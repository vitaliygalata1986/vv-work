import { BrowserRouter, Route, Routes } from 'react-router'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/PreviewPages'
import { ContactsPage } from './pages/ContactsPage'
import { PartnerPage } from './pages/PartnerPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="partners/:slug" element={<PartnerPage />} />
          <Route path="контакти" element={<ContactsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
