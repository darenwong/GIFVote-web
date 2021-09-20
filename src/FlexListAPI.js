import React, { useEffect, useState } from "react";
import { VariableSizeList } from "react-window";
import Poll from "./components/Poll";
import { useSQL } from "./contexts/SQLContext.js";
import InfiniteLoader from "react-window-infinite-loader";
//import useWindowDimensions from "./hooks/useWindowDimensions";
import { useWindowSize } from "@react-hook/window-size/throttled";

const Row = ({ index, style, data }) => {
  if (index == data.length) {
    return <div style={{ height: "50px" }}>Loading...</div>;
  }

  const {
    gifURL,
    gifHeight,
    gifWidth,
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

  const customStyle = {
    display: "flex",
    justifyContent: "center",
  };
  return (
    <div style={{ ...style, ...customStyle }}>
      <Poll
        gifURL={gifURL}
        gifHeight={gifHeight}
        gifWidth={gifWidth}
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

const FlexListAPI = () => {
  const {
    data,
    getUserData,
    getDataset,
    updateDataset,
    refreshDataset,
    handleFetchMoreData,
    handleFetchMoreDataPromise,
    isPersonal,
    setIsPersonal,
    hasMore,
    userId,
    setSortBy,
  } = useSQL();
  const [moreItemsLoading, setMoreItemsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [width, height] = useWindowSize();

  const getItemSize = (index) => {
    // return a size for items[index]
    if (index >= data.length) {
      console.log(index);
      return 120;
    }

    let videoContainerWidth = Math.min(600, Math.max(300, width * 0.5)) * 0.9;
    let renderedVideoHeight =
      (data[index].gifHeight * videoContainerWidth) / data[index].gifWidth;

    if (width >= 960) {
      renderedVideoHeight += 100;
    }

    console.log(index, renderedVideoHeight, videoContainerWidth, width);

    return renderedVideoHeight + 350;
  };

  const itemCount = hasNextPage ? data.length + 1 : data.length;

  /*
  const loadMoreItems = (startIndex, stopIndex) => {
    console.log("load more", startIndex, stopIndex);
    setMoreItemsLoading(true);
    getDataset()
      .then(() => {
        setMoreItemsLoading(false);
      })
      .catch(console.log);
    // method to fetch newer entries for the list
  };*/

  const loadMoreItems = (startIndex, stopIndex) => {
    console.log("loading more data", startIndex, stopIndex);
    return new Promise((resolve) => {
      handleFetchMoreDataPromise().then(() => {
        console.log("loaded more data");
        resolve("OK");
      });
      // method to fetch newer entries for the list
    });
  };

  return (
    <InfiniteLoader
      isItemLoaded={(index) =>
        index < data.length && data[index] !== null && index != 0
      }
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <VariableSizeList
          height={height}
          width={width}
          itemCount={itemCount}
          onItemsRendered={onItemsRendered}
          ref={ref}
          itemSize={getItemSize}
          itemData={data}
        >
          {Row}
        </VariableSizeList>
      )}
    </InfiniteLoader>
  );
};

export default FlexListAPI;
