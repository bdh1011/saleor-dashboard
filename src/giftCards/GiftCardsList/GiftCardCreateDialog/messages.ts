import { defineMessages } from "react-intl";

export const giftCardCreateDialogMessages = defineMessages({
  issueButtonLabel: {
    defaultMessage: "Issue",
    description: "GiftCardCreateDialog issue button label"
  },
  customerLabel: {
    defaultMessage: "Customer",
    description: "GiftCardCreateDialog customer label"
  },
  customerSubtitle: {
    defaultMessage:
      "Selected customer will be sent the generated gift card code. Someone else can redeem the gift card code. Gift card will be assigned to account which redeemed the code.",
    description: "GiftCardCreateDialog customer subtitle"
  },
  noteSubtitle: {
    defaultMessage:
      "Why was this gift card issued. This note will not be shown to the customer. Note will be stored in gift card history",
    description: "GiftCardCreateDialog note subtitle"
  }
});
