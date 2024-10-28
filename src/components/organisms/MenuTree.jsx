import React from "react";
import MenuItem from "../molecules/MenuItem";

const MenuTree = ({ data, onSelect, onAddMenu, expandedItems }) => {
  return (
    <ul>
      {data.map((item) => (
        <MenuItem
          key={item.id}
          item={item}
          onClick={onSelect}
          onAddMenuClick={(item) => onAddMenu && onAddMenu(item)} // Panggil onAddMenu sebagai fungsi jika ada
          expandedItems={expandedItems}
        />
      ))}
    </ul>
  );
};

export default MenuTree;
