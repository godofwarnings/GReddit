import ChartsEmbedSDK from '@mongodb-js/charts-embed-dom';
import { useEffect, useRef } from "react";

const Statistics = () => {
   const buttonref = useRef(null)
   const chartref = useRef(null)
   const sdk = new ChartsEmbedSDK({
      baseUrl: 'https://charts.mongodb.com/charts-project-0-naljt',
   });
// embed a chart
   const chart = sdk.createChart({
      chartId: '63f6e8cf-40f8-4348-87b7-c5f0a89fdcf2',
      width: 640,
      height: 400,
      background: '#0b4be9',
      filter: { "subreddit": { '$oid': "63ef6edff6c5e090848d7b08" } }
   });
// render the chart into a container
   useEffect(() => {
      chart
         .render(chartref.current)
         .catch(() => window.alert('Chart failed to initialise'))
      chart.setAutoRefresh(true);
   }, [])
   return (
      <div className="flex flex-row justify-center items-center">
         <div className="flex flex-row bg-neutral-content justify-start items-center h-[500px] w-[80%] space-y-2 rounded-md">
            <div ref={chartref} className="p-2 pl-5 rounded-md">
            </div>
            {/*<button className="bg-black" onClick={() => chart.refresh()}> refresh</button>*/}
         </div>
      </div>
   );
};

export default Statistics;
