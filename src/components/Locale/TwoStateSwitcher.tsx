import { MouseEvent, PropsWithChildren } from "react";
import i18n from "../../i18n";
import { useLocale } from "./LocaleContext";
import './TwoStateSwitcher.css'

export default function TwoStateSwitcher(props: PropsWithChildren
    & {
        backgrounds: {[key: string]: string}
        states: string[]
        className?: string
    }) {
    const { backgrounds, states, className } = props
    const { locale } = useLocale()

    const handleLanguageChange = (e: MouseEvent<HTMLDivElement>) => {
        if (states[0] == locale) {
            i18n.changeLanguage(states[1])
        }else{
            i18n.changeLanguage(states[0])
        }
    }
    return (
        <div className={`language-switcher-container ${className}`}>
            <div
                className="language-switcher-background"
                style={{ backgroundImage: `url(${import.meta.env.BASE_URL + backgrounds[locale]})` }}
            >
                <div className="language-switcher-content language-switcher-button" onClick={handleLanguageChange}>
                </div>
            </div>
        </div>
    );
}