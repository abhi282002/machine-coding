import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";

const Shape = ({ data }) => {
  const boxes = useMemo(() => data.flat(Infinity), [data]);
  const [unloading, setUnloading] = useState(false);
  const timerRef = useRef(null);
  const countOfVisibleBoxes = useMemo(() => {
    return boxes.reduce((acc, box) => {
      if (box === 1) {
        acc += 1;
      }
      return acc;
    }, 0);
  }, [boxes]);
  const [selected, setSelected] = useState(new Set());
  const handleClick = (e) => {
    const { target } = e;
    const index = target.getAttribute("data-index");
    const status = target.getAttribute("data-status");
    if (
      index == null ||
      status == "hidden" ||
      selected.has(index) ||
      unloading
    ) {
      return;
    }
    setSelected((prev) => {
      return new Set(prev.add(index));
    });
  };
  const unload = () => {
    setUnloading(true);
    const keys = Array.from(selected.keys());
    const removeNextKey = () => {
      if (keys.length) {
        const currentKey = keys.shift();
        setSelected((prev) => {
          const updatedKeys = new Set(prev);
          updatedKeys.delete(currentKey);
          return updatedKeys;
        });
      } else {
        setUnloading(false);
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(removeNextKey, 500);
    };
    timerRef.current = setTimeout(removeNextKey, 500);
  };
  useEffect(() => {
    if (selected.size >= countOfVisibleBoxes) {
      //unloading
      unload();
    }
  }, [selected]);
  return (
    <div className="boxes" onClick={handleClick}>
      {boxes.map((box, index) => {
        const status = box == 1 ? "visible" : "hidden";
        const isSelected = selected.has(index.toString());
        return (
          <div
            key={`${box}-${index}`}
            className={`box ${status} ${isSelected && "selected"}`}
            data-index={index}
            data-status={status}
          />
        );
      })}
    </div>
  );
};

export default Shape;
