import { LeafPoll } from 'react-leaf-polls'
import 'react-leaf-polls/dist/index.css'

// Persistent data array (typically fetched from the server)
const resData = [
  { text: 'Answer 1', votes: 0 },
  { text: 'Answer 2', votes: 0 },
  { text: 'Answer 3', votes: 0 }
]

const customTheme = {
  textColor: 'black',
  mainColor: '#00B87B',
  backgroundColor: 'rgb(255,255,255)',
  alignment: 'center'
}


const LeafChart = ({data, question}) => {
  return (
    <LeafPoll
      type='multiple'
      question={question}
      results={data}
      theme={customTheme}
    />
  )
};

export default LeafChart;