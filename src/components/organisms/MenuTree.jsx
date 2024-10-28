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
          onAddMenuClick={() => onAddMenu(item)} // Tambah menu untuk item saat ini
          expandedItems={expandedItems}
        />
      ))}
    </ul>
  );
};

export default MenuTree;
