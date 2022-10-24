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

    event Launch();
    /// @notice Explain to an end user what this does
    /// @dev Explain to a developer any extra details
    /// @param id a parameter just like in doxygen (must be followed by parameter name)
    event Cancel(uint256 id);
    event Pledge();
    event Claim();
    event Refund();

    /// @notice object that reprents a campaign
    struct Campaign {
        address creator;
        uint256 goalAmount;
        uint256 pledgedAmount;
        uint64 startDate;
        uint64 endDate;
        bool claimed;
    }

    /// @notice Token in which funds will be raised for each campaign
    /// @dev Tokens must be ERC20 compliant
    IERC20 public immutable token;
    /// @dev Counter for storage of campaign ids
    Counters.Counter private idCounter;
    /// @dev Mapping that stores the campaigns by their id
    mapping(uint256 => Campaign) public idsToCampaign;
    /// @dev timestamp = that represents the max duration for a campaign. I.e 60 days
    uint64 public immutable maxCampaignDurationInDays;

    /// @dev Contract constructor
    /// @param _token ERC20 token address
    /// @param _maxCampaignDurationInDays timestamp that represents the max duration for a campaign.
    constructor(address _token, uint64 _maxCampaignDurationInDays) {
        require(_token != address(0), "ERC20 address cannot be zero");
        require(
            _maxCampaignDurationInDays > 0,
            "Duration must be greater than zero"
        );
        token = IERC20(_token);
        maxCampaignDurationInDays = _maxCampaignDurationInDays;
    }

    function launch() external {}

    function cancel() external {}

    function claim() external {}

    function refund() external {}
}
