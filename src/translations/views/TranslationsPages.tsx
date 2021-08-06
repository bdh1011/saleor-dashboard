import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { stringify as stringifyQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";

import { getMutationState, maybe } from "../../misc";
import { LanguageCodeEnum } from "../../types/globalTypes";
import TranslationsPagesPage from "../components/TranslationsPagesPage";
import {
  TypedUpdateAttributeValueTranslations,
  TypedUpdatePageTranslations
} from "../mutations";
import { usePageTranslationDetails } from "../queries";
import { PageTranslationInputFieldName } from "../types";
import { UpdateAttributeValueTranslations } from "../types/UpdateAttributeValueTranslations";
import { UpdatePageTranslations } from "../types/UpdatePageTranslations";
import {
  languageEntitiesUrl,
  languageEntityUrl,
  TranslatableEntities
} from "../urls";
import { getParsedTranslationInputData } from "../utils";

export interface TranslationsPagesQueryParams {
  activeField: string;
}
export interface TranslationsPagesProps {
  id: string;
  languageCode: LanguageCodeEnum;
  params: TranslationsPagesQueryParams;
}

const TranslationsPages: React.FC<TranslationsPagesProps> = ({
  id,
  languageCode,
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();

  const pageTranslations = usePageTranslationDetails({
    variables: { id, language: languageCode }
  });

  const onEdit = (field: string) =>
    navigate(
      "?" +
        stringifyQs({
          activeField: field
        }),
      true
    );
  const onUpdate = (data: UpdatePageTranslations) => {
    if (data.pageTranslate.errors.length === 0) {
      pageTranslations.refetch();
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      navigate("?", true);
    }
  };

  const onAttributeValueUpdate = (data: UpdateAttributeValueTranslations) => {
    if (data.attributeValueTranslate.errors.length === 0) {
      pageTranslations.refetch();
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      navigate("?", true);
    }
  };

  const onDiscard = () => {
    navigate("?", true);
  };

  return (
    <TypedUpdatePageTranslations onCompleted={onUpdate}>
      {(updateTranslations, updateTranslationsOpts) => (
        <TypedUpdateAttributeValueTranslations
          onCompleted={onAttributeValueUpdate}
        >
          {(
            updateAttributeValueTranslations,
            updateAttributeValueTranslationsOpts
          ) => {
            const handleSubmit = (
              fieldName: PageTranslationInputFieldName,
              data: string | any
            ) => {
              const richTextValue =
                data &&
                data.blocks &&
                data.blocks[0].data &&
                data.blocks[0].data.text;
              const isRichText = richTextValue !== "undefined";

              if (isRichText) {
                updateAttributeValueTranslations({
                  variables: {
                    id,
                    input: { richText: JSON.stringify(richTextValue) },
                    language: languageCode
                  }
                });
              } else {
                updateTranslations({
                  variables: {
                    id,
                    input: getParsedTranslationInputData({ data, fieldName }),
                    language: languageCode
                  }
                });
              }
            };

            const saveButtonState = getMutationState(
              updateTranslationsOpts.called ||
                updateAttributeValueTranslationsOpts.called,
              updateTranslationsOpts.loading ||
                updateAttributeValueTranslationsOpts.loading,
              maybe(() => updateTranslationsOpts.data.pageTranslate.errors, []),
              maybe(
                () =>
                  updateAttributeValueTranslationsOpts.data
                    .attributeValueTranslate.errors,
                []
              )
            );

            const translation = pageTranslations?.data?.translation;

            return (
              <TranslationsPagesPage
                activeField={params.activeField}
                disabled={
                  pageTranslations.loading || updateTranslationsOpts.loading
                }
                languageCode={languageCode}
                languages={shop?.languages || []}
                saveButtonState={saveButtonState}
                onBack={() =>
                  navigate(
                    languageEntitiesUrl(languageCode, {
                      tab: TranslatableEntities.pages
                    })
                  )
                }
                onEdit={onEdit}
                onDiscard={onDiscard}
                onLanguageChange={lang =>
                  navigate(
                    languageEntityUrl(lang, TranslatableEntities.pages, id)
                  )
                }
                onSubmit={handleSubmit}
                data={
                  translation?.__typename === "PageTranslatableContent"
                    ? translation
                    : null
                }
              />
            );
          }}
        </TypedUpdateAttributeValueTranslations>
      )}
    </TypedUpdatePageTranslations>
  );
};
TranslationsPages.displayName = "TranslationsPages";
export default TranslationsPages;
