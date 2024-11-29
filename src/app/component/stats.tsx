export default function stats({statsData}: any) {
  return (
    <>
      <div className="stats stats-horizontal mb-4 shadow-lg bg-slate-100 text-slate-600 w-full md:w-1/3">
        <div className="stat border-slate-300 border-r-2">
          <div className="stat-title text-slate-600">Gateway</div>
          <div className="stat-value">{statsData?.gateway? statsData.gateway : '-'}</div>
        </div>

        <div className="stat">
          <div className="stat-title text-slate-600">VPN</div>
          <div className="stat-value">{statsData?.vpn? statsData.vpn : '-'}</div>
        </div>
      </div>
    </>
  )
}