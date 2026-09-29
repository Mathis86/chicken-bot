import i18next from "i18next"
import en from '../locales/en.json'
import fr from '../locales/fr.json'

i18next.init({
    fallbackLng: 'fr',
    defaultNS: "common",
    resources: { en, fr }
})

export default i18next