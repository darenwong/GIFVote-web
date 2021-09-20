import React from "react";
import faker from "faker";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles({
  container: {
    position: "relative",
  },
});

const ListContainer = (props) => {
  const classes = useStyles();
  return <Container maxWidth="sm" className={classes.container} {...props} />;
};

const AppTest = () => {
  const [data, setData] = React.useState([]);

  if (data.length === 0) {
    setData(Array.from({ length: 50 }).map((_) => null));
  }

  const isItemLoaded = (index) => index < data.length && data[index] !== null;
  const loadMoreItems = (startIndex, stopIndex) => {
    console.log("preparing", startIndex, stopIndex);
    return new Promise((resolve) => {
      setTimeout(() => {
        const newData = [...data];
        for (let idx = startIndex; idx < stopIndex; idx++) {
          newData[idx] = faker.lorem.sentence();
        }
        console.log("loaded more data", startIndex, stopIndex);
        setData(newData);
        resolve();
      }, 2000);
    });
  };

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={data.length}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <List
          className="List"
          height={500}
          width={500}
          itemCount={data.length}
          itemSize={230}
          itemData={data}
          innerElementType={ListContainer}
          onItemsRendered={onItemsRendered}
          ref={ref}
        >
          {SimpleCard}
        </List>
      )}
    </InfiniteLoader>
  );
};

export default AppTest;

const SimpleCard = ({ index, style, data }) => {
  return <div style={style}>{data[index]}</div>;
};
