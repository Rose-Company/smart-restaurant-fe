import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTable from "./en/table.json";
import viTable from "./vi/table.json";
import enCommon from "./en/common.json";
import viCommon from "./vi/common.json";
import enCustomer from "./en/customer.json";
import viCustomer from "./vi/customer.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { table: enTable, common: enCommon, customer: enCustomer },
      vi: { table: viTable, common: viCommon, customer: viCustomer },
    },
    lng: "vi",
    fallbackLng: "en",
    ns: ["common", "table", "customer"],
    interpolation: { escapeValue: false },
  });

export default i18n;
