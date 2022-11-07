// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title Crowdfunding
/// @author @loopstudio
/// @notice Contract for campaigns fundraising
/// @dev Contract that enables to raise funds using ERC20 tokens. campaigns pledged amount can be claimed if
//  goal is met on the defined period of time. Otherwhise, the funds should be refunded.
contract Crowdfunding {
    /// @dev Using SafeERC20 to eliminates the need to handle boolean return values for ERC20 methods (i.e transfer)
    using SafeERC20 for IERC20;
    /// @dev Using Counters to restrict id increments by 1
    using Counters for Counters.Counter;

    /// @dev Event emited when Campaign launch succeeds
    event Launch(
        uint256 id,
        uint256 goal,
        address indexed creator,
        uint64 startDate,
        uint64 endDate
    );

    /// @dev Event emited when Campaign cancelation succeeds
    event Cancel(uint256 id);
    // @dev Event emited when Campaign receives a contribution
    event Pledge(uint256 id, address indexed pledger, uint256 amount);
    // @dev Event emited when pledger withdraw a contribution
    event Unpledge(uint256 id, address indexed pledger, uint256 amount);
    event Claim();
    // @dev Event emited when pledger performs a refund
    event Refund(uint256 id, address indexed pledger, uint256 amount);

    /// @dev Status of a campaign. Note: Refunded status is not represented since the need of
    // keeping track of how many bakers are left to refund (gas consuming) and it doesnt bring any
    // adventage/ussage
    enum CampaignStatus {
        Created,
        Canceled,
        Claimed
    }

    /// @notice object that reprents a campaign
    struct Campaign {
        address creator;
        uint256 goalAmount;
        uint256 pledgedAmount;
        uint64 startDate;
        uint64 endDate;
        CampaignStatus status;
    }

    /// @notice Token address in which funds will be raised for each campaign
    /// @dev Token must be ERC20 compliant
    address public immutable tokenAddress;
    /// @dev Counter for storage of campaign ids
    Counters.Counter private idCounter;
    /// @dev Mapping that stores the campaigns by their id
    mapping(uint256 => Campaign) public idsToCampaigns;
    /// @dev Mapping that stores by campaingId, the amount pledged by address. Id -> pledger -> amount
    mapping(uint256 => mapping(address => uint256))
        public idsToPledgedAmountByAddress;
    /// @dev timestamp = that represents the max duration for a campaign. I.e 60 days
    uint64 public immutable maxCampaignDurationInDays;

    /// @dev Contract constructor
    /// @param _token ERC20 token address
    /// @param _maxCampaignDurationInDays timestamp that represents the max duration for a campaign.
    constructor(address _token, uint64 _maxCampaignDurationInDays) {
        require(_token != address(0), "ERC20 address cannot be zero");
        require(
            _maxCampaignDurationInDays > 0,
            "Duration must be gt than zero"
        );

        tokenAddress = _token;
        maxCampaignDurationInDays = _maxCampaignDurationInDays;
    }

    function launch(
        uint256 _goalAmount,
        uint64 _startDate,
        uint64 _endDate
    ) external {
        require(_goalAmount > 0, "Goal must be gt 0");
        require(_startDate >= block.timestamp, "Start must be gte now");
        require(_endDate > _startDate, "End date must be gt start date");
        require(
            _endDate - _startDate <= maxCampaignDurationInDays,
            "Duration exceeds maximum"
        );

        idCounter.increment();
        uint256 campaignId = idCounter.current();

        idsToCampaigns[campaignId] = Campaign({
            creator: msg.sender,
            goalAmount: _goalAmount,
            pledgedAmount: 0,
            startDate: _startDate,
            endDate: _endDate,
            status: CampaignStatus.Created
        });

        emit Launch(campaignId, _goalAmount, msg.sender, _startDate, _endDate);
    }

    /// @notice Cancels a campaign
    /// @dev Cancels a campaign, changing the status to Canceled and emits a Cancel event.
    /// @param _campaignId id of the campaign to cancel
    function cancel(uint256 _campaignId) external {
        Campaign storage campaign = idsToCampaigns[_campaignId];
        require(campaign.creator != address(0), "Not exists");
        require(campaign.creator == msg.sender, "Not creator");
        campaign.status = CampaignStatus.Canceled;
        emit Cancel(_campaignId);
    }

    /// @notice Contribute to campaign
    /// @dev Contribute to a campaign if started and not ended. Perform a SafeER20.transferFrom that
    // requires previous allowance set. Emmit a Pledge event if succeed.
    /// @param _campaignId id of the campaign pledge
    /// @param _amount the amount to pledge
    function pledge(uint256 _campaignId, uint256 _amount) external {
        require(_amount > 0, "Pledge amount must be gt 0");
        Campaign storage campaign = idsToCampaigns[_campaignId];
        require(campaign.creator != address(0), "Not exists");
        require(campaign.status == CampaignStatus.Created, "Invalid status");
        require(campaign.startDate <= block.timestamp, "Not started");
        require(campaign.endDate > block.timestamp, "Ended");

        campaign.pledgedAmount += _amount;
        idsToPledgedAmountByAddress[_campaignId][msg.sender] += _amount;

        IERC20(tokenAddress).safeTransferFrom(
            msg.sender,
            address(this),
            _amount
        );

        emit Pledge(_campaignId, msg.sender, _amount);
    }

    /// @notice Unpledge contribution to campaign
    /// @dev Unpledge contribution made to a campaign if not ended. Perform a SafeER20.transferFrom.
    /// Emit a Unpledge event if succeed.
    /// @param _campaignId id of the campaign to unpledge
    /// @param _amount the amount to unpledge
    function unpledge(uint256 _campaignId, uint256 _amount) external {
        require(_amount > 0, "Unpledge amount must be gt 0");
        Campaign storage campaign = idsToCampaigns[_campaignId];
        require(campaign.creator != address(0), "Not exists");
        require(campaign.endDate > block.timestamp, "Ended");
        uint256 pledgerAmount = idsToPledgedAmountByAddress[_campaignId][
            msg.sender
        ];
        require(pledgerAmount >= _amount, "Insufficient balance to unpledge");

        campaign.pledgedAmount -= _amount;
        idsToPledgedAmountByAddress[_campaignId][msg.sender] -= _amount;

        IERC20(tokenAddress).safeTransfer(msg.sender, _amount);

        emit Unpledge(_campaignId, msg.sender, _amount);
    }

    function claim() external {}

    /// @notice Refund the pledged amount if ended and goal was not reached.
    /// @dev Performs a refund operation of the pledger amount if campaing does not reached the goal.
    /// Performs a safeTransfer to the msg.sender and emits a Refund event.
    /// @param _campaignId id of the campaign to refund .
    function refund(uint256 _campaignId) external {
        Campaign storage campaign = idsToCampaigns[_campaignId];
        require(campaign.creator != address(0), "Not exists");
        require(campaign.endDate < block.timestamp, "Still active");
        require(
            campaign.pledgedAmount < campaign.goalAmount,
            "Campaign reached its goal"
        );
        uint256 pledgerAmount = idsToPledgedAmountByAddress[_campaignId][
            msg.sender
        ];
        require(pledgerAmount > 0, "No funds to refund");

        idsToPledgedAmountByAddress[_campaignId][msg.sender] -= pledgerAmount;
        campaign.pledgedAmount -= pledgerAmount;

        IERC20(tokenAddress).safeTransfer(msg.sender, pledgerAmount);

        emit Refund(_campaignId, msg.sender, pledgerAmount);
    }
}
