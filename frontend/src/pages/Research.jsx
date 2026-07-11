// ─── pages/Research.jsx ───────────────────────────────────────────────────────
// Main research page. Composes the Navbar, Header, TabBar, and individual tabs.
// Data fetching logic is delegated to the useResearch hook.
// ─────────────────────────────────────────────────────────────────────────────

import { useState }      from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useResearch }   from '../hooks/useResearch.js'
import Navbar            from '../components/Navbar.jsx'
import LoadingState      from '../components/LoadingState.jsx'
import ErrorState        from '../components/ErrorState.jsx'
import CompanyHeader     from '../components/CompanyHeader.jsx'
import TabBar            from '../components/TabBar.jsx'
import Footer            from '../components/Footer.jsx'
import VerdictTab        from '../components/tabs/VerdictTab.jsx'
import PastTab           from '../components/tabs/PastTab.jsx'
import PresentTab        from '../components/tabs/PresentTab.jsx'
import FutureTab         from '../components/tabs/FutureTab.jsx'
import RelatedCompaniesTab from '../components/tabs/RelatedCompaniesTab.jsx'

function Research() {
  const { query } = useParams()
  const navigate  = useNavigate()
  
  const [activeTab, setActiveTab] = useState(0)

  // Fetch logic extracted to a clean hook
  const { data, loading, error, loadingStep } = useResearch(
    query ? decodeURIComponent(query) : ''
  )

  const verdict = data?.ai?.verdict || 'WAIT'

  return (
    <div style={{ background: '#0A0A0B', minHeight: '100vh' }}>
      <Navbar />

      {loading && <LoadingState loadingStep={loadingStep} />}
      {!loading && error && <ErrorState message={error} />}

      {!loading && !error && data && (
        <>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px 0' }}>
            <CompanyHeader company={data.company} />
          </div>

          <TabBar 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            verdict={verdict} 
          />

          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px 60px' }}>
            {activeTab === 0 && <VerdictTab data={data} />}
            {activeTab === 1 && <PastTab data={data} />}
            {activeTab === 2 && <PresentTab data={data} />}
            {activeTab === 3 && <FutureTab data={data} />}
            {activeTab === 4 && (
              <RelatedCompaniesTab 
                data={data} 
                onCompanyClick={(name) => navigate(`/research/${encodeURIComponent(name)}`)}
              />
            )}
          </div>

          <Footer />
        </>
      )}
    </div>
  )
}

export default Research
