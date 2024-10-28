import React, { useState, useEffect } from "react";
import InputField from "../atoms/InputField";
import Button from "../atoms/Button";

const MenuForm = ({ selectedMenu, allItems, onUpdate, onDelete }) => {
  const [menu, setMenu] = useState(selectedMenu || {});

  useEffect(() => {
    setMenu(selectedMenu || {});
  }, [selectedMenu]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "parent_id") {
      const selectedParent = allItems.find((item) => item.id === value);
      const newDepth = selectedParent ? selectedParent.depth + 1 : 1;

      setMenu({
        ...menu,
        parent_id: value,
        menu_id: selectedParent ? selectedParent.menu_id : "",
        depth: newDepth,
      });
    } else {
      setMenu({ ...menu, [name]: value });
    }
  };

  const handleSave = () => {
    if (menu.name) {
      const confirmed = window.confirm(
        "Are you sure you want to update this menu item?"
      );
      if (confirmed) {
        onUpdate(menu);
      }
    } else {
      alert("Please enter a name for the menu item.");
    }
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this menu item?"
    );
    if (confirmed) {
      onDelete(menu.id);
    }
  };

  return (
    <div className="bg-white p-6 shadow rounded">
      <InputField label="Menu ID" value={menu.id || ""} disabled />
      <InputField
        label="Depth"
        value={menu.depth || ""}
        name="depth"
        onChange={handleChange}
        type="number"
        disabled
      />
      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Parent Data</label>
        <select
          name="parent_id"
          value={menu.parent_id || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded bg-gray-100"
        >
          <option value="">No Parent</option>
          {allItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <InputField
        label="Name"
        value={menu.name || ""}
        name="name"
        onChange={handleChange}
      />
      <div className="flex space-x-2">
        <Button onClick={handleSave} className="bg-blue-500 text-white">
          Save
        </Button>
        {menu.id && (
          <Button onClick={handleDelete} className="bg-red-500 text-white">
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default MenuForm;
