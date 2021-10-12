import React from "react";
import { FixedSizeList } from "react-window";

//const items = [...] // some list of items

const Row = ({ index, style }) => {
  const getStyle = () => {
    return index % 2 == 0
      ? { backgroundColor: "yellow" }
      : { backgroundColor: "blue" };
  };

  return (
    <div style={style}>
      <div style={getStyle()}>Hello {index}</div>
    </div>
  );
};

const FixedListTest = () => (
  <FixedSizeList height={500} width={500} itemSize={120} itemCount={100}>
    {Row}
  </FixedSizeList>
);

export default FixedListTest;
