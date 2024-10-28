import React, { useState, useEffect } from "react";

const MenuItem = ({ item, onClick, onAddMenuClick, expandedItems }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(!!expandedItems[item.id]);
  }, [expandedItems, item.id]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    onClick(item);
  };

  return (
    <li>
      <div onClick={toggleOpen} className="cursor-pointer flex items-center">
        {item.children_recursive?.length > 0 && (
          <span className="mr-2 text-gray-500">{isOpen ? "v" : ">"}</span>
        )}
        <span className="text-gray-800">{item.name}</span>
        {/*  */}
        {item.name === "System Code" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddMenuClick(item); // Panggil handleAddMenu
            }}
            className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-full"
          >
            +
          </button>
        )}
      </div>
      {isOpen && item.children_recursive?.length > 0 && (
        <ul className="ml-4 border-l border-gray-300 pl-2">
          {item.children_recursive.map((child) => (
            <MenuItem
              key={child.id}
              item={child}
              onClick={onClick}
              onAddMenuClick={onAddMenuClick}
              expandedItems={expandedItems}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default MenuItem;
