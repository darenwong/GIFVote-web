import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { pollActions, handleFetchMoreDataPromise } from "../../store/pollSlice";

import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  CircularProgress,
  List,
  ListItemIcon,
  ListItemText,
  ListItem,
  IconButton,
} from "@material-ui/core";
import { VariableSizeList } from "react-window";
import Poll from "../../components/poll/Poll";
import InfiniteLoader from "react-window-infinite-loader";
import { useWindowSize } from "@react-hook/window-size/throttled";
import AutoSizer from "react-virtualized-auto-sizer";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {},
  loading: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    padding: theme.spacing(1),
  },
  seeMore: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  seeMoreButton: {
    margin: theme.spacing(1),
  },
}));

const Row = ({ index, style, isScrolling, data }) => {
  const classes = useStyles();
  const hasMore = useSelector(state => state.poll.hasMore);
  const httpError = useSelector(state=>state.error);
  const history = useHistory();

  if (index == data.length && hasMore == false) {
    return (
      <div style={{ ...style }}>
        <div className={classes.seeMore}>
          <Typography>See more post</Typography>
          <IconButton
            variant="contained"
            color="primary"
            className={classes.seeMoreButton}
            onClick={() => history.push("/")}
          >
            <KeyboardArrowRight />
          </IconButton>
        </div>
      </div>
    );
  }

  if (index == data.length && hasMore == true) {
    return (
      <div style={{ ...style }} className={classes.loading}>
        <List>
          {httpError['getDataset'].open && 
            <ListItem>
              <ListItemText primary="Something Went Wrong" />
            </ListItem>          
          }
          {!httpError['getDataset'].open && 
            <ListItem>
              <ListItemIcon>
                <CircularProgress />
              </ListItemIcon>
              <ListItemText primary="Loading..." />
            </ListItem>
          }
        </List>
      </div>
    );
  }

  const {
    gifURL,
    gifimage,
    gifHeight,
    gifWidth,
    user_id,
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
    alignItems: "center",
    flexDirection: "column",
  };
  return (
    <div style={{ ...style, ...customStyle }}>
      <Poll
        gifURL={gifURL}
        gifimage={gifimage}
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
        isScrolling={isScrolling}
      />
    </div>
  );
};

const FlexListAPI = ({ personal, userProfileId, isFollowing }) => {
  const dispatch = useDispatch();
  const hasMore = useSelector(state=>state.poll.hasMore);
  const data = useSelector(state=>state.poll.data);
  const [moreItemsLoading, setMoreItemsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [width, height] = useWindowSize();

  useEffect(() => {
    dispatch(pollActions.refreshDataset());
  }, []);

  const getItemSize = (index) => {
    // return a size for items[index]
    if (index >= data.length) {
      return 120;
    }

    let videoContainerWidth = Math.min(600, Math.max(300, width * 0.5));
    let renderedVideoHeight =
      (data[index].gifHeight * videoContainerWidth) / data[index].gifWidth;


    return renderedVideoHeight + 273 + 40;
  };

  const itemCount = hasMore ? data.length + 1 : data.length + 1;


  const loadMoreItems = (startIndex, stopIndex) => {

    if (stopIndex < data.length) {
      return;
    }
    return dispatch(handleFetchMoreDataPromise({
        isPersonal: { state: personal, createdBy: userProfileId },
        isFollowing,
      }));
  };

  return (
    <div style={{ flex: "1 1 auto", overflow: "hidden" }}>
      <AutoSizer>
        {({ height, width }) => (
          <InfiniteLoader
            isItemLoaded={(index) =>
              index < data.length && data[index] !== null && false
            }
            itemCount={itemCount}
            loadMoreItems={loadMoreItems}
          >
            {({ onItemsRendered, ref }) => (
              <VariableSizeList
                height={width <= 600 ? height - 64 - 48 : height - 64}
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
        )}
      </AutoSizer>
    </div>
  );
};

export default FlexListAPI;
