import React, { useEffect } from "react";
import { VariableSizeList } from "react-window";
import Poll from "./components/Poll";
import { useSQL } from "./contexts/SQLContext.js";
//const items = [...] // some list of items

const Row = ({ index, style }) => {
  const {
    data,
    getUserData,
    getDataset,
    updateDataset,
    refreshDataset,
    handleFetchMoreData,
    isPersonal,
    setIsPersonal,
    hasMore,
    userId,
    setSortBy,
  } = useSQL();

  const {
    gifURL,
    userId: user_id,
    poll_text,
    created_by,
    user_avatar,
    created_at,
    winner,
    chartData,
    voteData,
    poll_id,
    isVoted_bool,
    totalVoteCount,
    comment_count,
    num_likes,
    user_liked,
  } = data[index];

  return (
    <div style={style}>
      <Poll
        gifURL={gifURL}
        key={index}
        user_id={user_id}
        title={poll_text}
        created_by={created_by}
        user_avatar={user_avatar}
        created_at={created_at}
        winner={winner}
        chartData={chartData}
        data={voteData}
        poll_id={poll_id}
        isVoted_bool={isVoted_bool}
        totalVoteCount={totalVoteCount}
        comment_count={comment_count}
        num_likes={num_likes}
        user_liked={user_liked}
      />
    </div>
  );
};

const getItemSize = (index) => {
  // return a size for items[index]
  return 500;
};

const FlexListTest = () => {
  const {
    data,
    getUserData,
    getDataset,
    updateDataset,
    refreshDataset,
    handleFetchMoreData,
    isPersonal,
    setIsPersonal,
    hasMore,
    userId,
    setSortBy,
  } = useSQL();

  useEffect(() => {
    getDataset();
  }, []);

  return (
    <VariableSizeList
      height={500}
      width={500}
      itemCount={data.length}
      itemSize={getItemSize}
    >
      {Row}
    </VariableSizeList>
  );
};

export default FlexListTest;
