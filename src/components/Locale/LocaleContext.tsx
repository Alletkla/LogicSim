import i18n from "../../i18n"
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react"
import { supportedLngs as suplngs } from "../../i18n"

const defaultValue = {
    supportedLngs: suplngs,
    locale: 'de',
    setLocale: (newLocale: string): void => { }
}

export const LocaleContext = createContext(defaultValue)

export function LocaleProvider({ children }: PropsWithChildren) {
    const [locale, setLocale] = useState(i18n.language)
    const supportedLngs = suplngs

    useEffect(() => {
        i18n.on('languageChanged', (lang) => setLocale(lang))
    }, [])


    return (
        <LocaleContext.Provider value={{ supportedLngs, locale, setLocale }}>
            {children}
        </LocaleContext.Provider>
    )
}

export function useLocale() {
    const context = useContext(LocaleContext)
    if (!context) {
        throw new Error('useLocale must be used within a LocaleProvider')
    }
    return context

}