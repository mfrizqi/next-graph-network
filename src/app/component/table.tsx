export default function Table({ dataTable }: any) {


  console.log(dataTable)

  return (
    <>
      <div className="card bg-slate-100 w-full shadow-lg rounded-lg">
        <div className="card-body">
          <div className="overflow-x-auto text-slate-600">
            <table className="table px-4">
              {/* head */}
              <thead className="text-slate-600">
                <tr className="bg-slate-300">
                  <th className="text-base rounded-tl-lg">No</th>
                  <th className="text-base">Node Name</th>
                  <th className="text-base">IPv4</th>
                  <th className="text-base rounded-tr-lg">Group</th>
                </tr>
              </thead>
              <tbody>
                {dataTable?.map((data: any, index: number) => {
                  return (<tr key={data?.id}>
                    <td>{index + 1}</td>
                    <td>{data?.label}</td>
                    <td>{data?.IPv4}</td>
                    <td>{data?.group}</td>
                  </tr>)
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}