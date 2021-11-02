import "../components/page-panel.js";
import "../components/page-body.js";
import "../components/action-card.js";
import "../components/account-widget.js";
import "../components/text-widget.js";
import "../components/number-widget.js";
import "../components/switch-widget.js";

import DappLib from "@decentology/dappstarter-dapplib";
import { LitElement, html, customElement, property } from "lit-element";

@customElement("sample-harness")
export default class SampleHarness extends LitElement {
  @property()
  title;
  @property()
  category;
  @property()
  description;

  createRenderRoot() {
    return this;
  }

  constructor(args) {
    super(args);
  }

  render() {
    let content = html`
      <page-body
        title="${this.title}"
        category="${this.category}"
        description="${this.description}"
      >
        <!-- Registry -->

        <action-card
          title="Registry - Get Auth NFT"
          description="Register a Tenant with the RegistryService to get an AuthNFT"
          action="receiveAuthNFT"
          method="post"
          fields="signer"
        >
          <account-widget field="signer" label="Account"> </account-widget>
        </action-card>

        <action-card
          title="Registry - Has Auth NFT"
          description="Checks to see if an account has an AuthNFT"
          action="hasAuthNFT"
          method="get"
          fields="tenant"
        >
          <account-widget field="tenant" label="Tenant Account">
          </account-widget>
        </action-card>

        <action-card
          title="RegistryVotingContract - Get Tenant"
          description="Get an instance of a Tenant from RegistryVotingContract to have your own data"
          action="receiveTenant"
          method="post"
          fields="signer"
        >
          <account-widget field="signer" label="Account"> </account-widget>
        </action-card>

        <!-- Flow Token -->
        <action-card
          title="Get Balance"
          description="Get the Flow Token balance of an account"
          action="getBalance"
          method="get"
          fields="account"
        >
          <account-widget field="account" label="Account"> </account-widget>
        </action-card>
        <!-- Voting Cards --->
        <action-card
          title="Create proposal"
          description="Create a new proposal to vote on"
          action="createProposal"
          method="post"
          fields="proposalDesc signer"
        >
          <account-widget field="signer" label="Account"> </account-widget>
          <text-widget
            field="proposalDesc"
            label="Description"
            placeholder="All in favour of a 3 day weekend!"
          ></text-widget>
        </action-card>
        <action-card
          title="List all Proposals"
          description="List the live proposals associated with an account"
          action="listProposals"
          method="get"
          fields="account"
        >
          <account-widget field="account" label="Account"> </account-widget>
        </action-card>
        <action-card
          title="Issue Ballot"
          description="Issue Ballot to another user"
          action="issueBallot"
          method="post"
          fields="signer recipient proposalId"
        >
          <account-widget field="signer" label="Issuer"> </account-widget>
          <account-widget field="recipient" label="Recipient"> </account-widget>
          <text-widget
            field="proposalId"
            label="Proposal ID"
            placeholder="ID of proposal to issue ballot for"
          ></text-widget>
        </action-card>
        <action-card
          title="List ballots"
          description="Get ballots that have been issued to an account"
          action="listBallots"
          method="get"
          fields="account"
        >
          <account-widget field="account" label="Account"> </account-widget>
        </action-card>
        <action-card
          title="Vote Using Ballot"
          description="Vote on issued ballot"
          action="voteOnBallot"
          method="post"
          fields="issuer signer proposalId decision"
        >
          <account-widget field="issuer" label="Issuer"> </account-widget>
          <account-widget field="signer" label="Signer"> </account-widget>
          <text-widget
            field="proposalId"
            label="Proposal ID"
            placeholder="ID of proposal to issue ballot for"
          ></text-widget>
          <switch-widget
            field="decision"
            label="In favour (tick)/Against (unticked)"
          ></switch-widget>
        </action-card>
      </page-body>
      <page-panel id="resultPanel"></page-panel>
    `;

    return content;
  }
}
