import { Suspense } from 'react'
import BodyWidget from './components/BodyWidget'
import Header from './components/Header'

export default function App() {
    return (
        <>
        <Suspense fallback="...loading">
            <Header></Header>
            <BodyWidget />
        </Suspense>
        </>
    )
}