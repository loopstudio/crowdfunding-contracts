/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export interface CrowdfundingInterface extends utils.Interface {
  functions: {
    "cancel()": FunctionFragment;
    "claim()": FunctionFragment;
    "idsToCampaigns(uint256)": FunctionFragment;
    "launch(uint256,uint64,uint64)": FunctionFragment;
    "maxCampaignDurationInDays()": FunctionFragment;
    "refund()": FunctionFragment;
    "token()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "cancel"
      | "claim"
      | "idsToCampaigns"
      | "launch"
      | "maxCampaignDurationInDays"
      | "refund"
      | "token"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "cancel", values?: undefined): string;
  encodeFunctionData(functionFragment: "claim", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "idsToCampaigns",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "launch",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "maxCampaignDurationInDays",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "refund", values?: undefined): string;
  encodeFunctionData(functionFragment: "token", values?: undefined): string;

  decodeFunctionResult(functionFragment: "cancel", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "claim", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "idsToCampaigns",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "launch", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "maxCampaignDurationInDays",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "refund", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "token", data: BytesLike): Result;

  events: {
    "Cancel(uint256)": EventFragment;
    "Claim()": EventFragment;
    "Launch(uint256,uint256,address,uint64,uint64)": EventFragment;
    "Pledge()": EventFragment;
    "Refund()": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Cancel"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Claim"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Launch"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Pledge"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Refund"): EventFragment;
}

export interface CancelEventObject {
  id: BigNumber;
}
export type CancelEvent = TypedEvent<[BigNumber], CancelEventObject>;

export type CancelEventFilter = TypedEventFilter<CancelEvent>;

export interface ClaimEventObject {}
export type ClaimEvent = TypedEvent<[], ClaimEventObject>;

export type ClaimEventFilter = TypedEventFilter<ClaimEvent>;

export interface LaunchEventObject {
  id: BigNumber;
  goal: BigNumber;
  creator: string;
  startDate: BigNumber;
  endDate: BigNumber;
}
export type LaunchEvent = TypedEvent<
  [BigNumber, BigNumber, string, BigNumber, BigNumber],
  LaunchEventObject
>;

export type LaunchEventFilter = TypedEventFilter<LaunchEvent>;

export interface PledgeEventObject {}
export type PledgeEvent = TypedEvent<[], PledgeEventObject>;

export type PledgeEventFilter = TypedEventFilter<PledgeEvent>;

export interface RefundEventObject {}
export type RefundEvent = TypedEvent<[], RefundEventObject>;

export type RefundEventFilter = TypedEventFilter<RefundEvent>;

export interface Crowdfunding extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: CrowdfundingInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    cancel(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    claim(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    idsToCampaigns(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [string, BigNumber, BigNumber, BigNumber, BigNumber, boolean] & {
        creator: string;
        goalAmount: BigNumber;
        pledgedAmount: BigNumber;
        startDate: BigNumber;
        endDate: BigNumber;
        claimed: boolean;
      }
    >;

    launch(
      _goalAmount: PromiseOrValue<BigNumberish>,
      _startDate: PromiseOrValue<BigNumberish>,
      _endDate: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    maxCampaignDurationInDays(overrides?: CallOverrides): Promise<[BigNumber]>;

    refund(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    token(overrides?: CallOverrides): Promise<[string]>;
  };

  cancel(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  claim(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  idsToCampaigns(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [string, BigNumber, BigNumber, BigNumber, BigNumber, boolean] & {
      creator: string;
      goalAmount: BigNumber;
      pledgedAmount: BigNumber;
      startDate: BigNumber;
      endDate: BigNumber;
      claimed: boolean;
    }
  >;

  launch(
    _goalAmount: PromiseOrValue<BigNumberish>,
    _startDate: PromiseOrValue<BigNumberish>,
    _endDate: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  maxCampaignDurationInDays(overrides?: CallOverrides): Promise<BigNumber>;

  refund(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  token(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    cancel(overrides?: CallOverrides): Promise<void>;

    claim(overrides?: CallOverrides): Promise<void>;

    idsToCampaigns(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [string, BigNumber, BigNumber, BigNumber, BigNumber, boolean] & {
        creator: string;
        goalAmount: BigNumber;
        pledgedAmount: BigNumber;
        startDate: BigNumber;
        endDate: BigNumber;
        claimed: boolean;
      }
    >;

    launch(
      _goalAmount: PromiseOrValue<BigNumberish>,
      _startDate: PromiseOrValue<BigNumberish>,
      _endDate: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    maxCampaignDurationInDays(overrides?: CallOverrides): Promise<BigNumber>;

    refund(overrides?: CallOverrides): Promise<void>;

    token(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "Cancel(uint256)"(id?: null): CancelEventFilter;
    Cancel(id?: null): CancelEventFilter;

    "Claim()"(): ClaimEventFilter;
    Claim(): ClaimEventFilter;

    "Launch(uint256,uint256,address,uint64,uint64)"(
      id?: null,
      goal?: null,
      creator?: PromiseOrValue<string> | null,
      startDate?: null,
      endDate?: null
    ): LaunchEventFilter;
    Launch(
      id?: null,
      goal?: null,
      creator?: PromiseOrValue<string> | null,
      startDate?: null,
      endDate?: null
    ): LaunchEventFilter;

    "Pledge()"(): PledgeEventFilter;
    Pledge(): PledgeEventFilter;

    "Refund()"(): RefundEventFilter;
    Refund(): RefundEventFilter;
  };

  estimateGas: {
    cancel(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    claim(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    idsToCampaigns(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    launch(
      _goalAmount: PromiseOrValue<BigNumberish>,
      _startDate: PromiseOrValue<BigNumberish>,
      _endDate: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    maxCampaignDurationInDays(overrides?: CallOverrides): Promise<BigNumber>;

    refund(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    token(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    cancel(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    claim(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    idsToCampaigns(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    launch(
      _goalAmount: PromiseOrValue<BigNumberish>,
      _startDate: PromiseOrValue<BigNumberish>,
      _endDate: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    maxCampaignDurationInDays(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    refund(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    token(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
