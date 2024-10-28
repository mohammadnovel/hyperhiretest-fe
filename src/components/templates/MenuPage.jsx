import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "../atoms/Button";
import MenuTree from "../organisms/MenuTree";
import MenuForm from "../organisms/MenuForm";
import Loader from "../atoms/Loader";

const MenuPage = () => {
  const [menuOptions, setMenuOptions] = useState([]); // Opsi untuk dropdown
  const [selectedMenuId, setSelectedMenuId] = useState(null); // Menu yang dipilih
  const [menuData, setMenuData] = useState([]); // Data menu untuk tampilan tree
  const [allItems, setAllItems] = useState([]); // Semua item menu untuk dropdown parent
  const [isLoading, setIsLoading] = useState(true); // Status loading
  const [expandedItems, setExpandedItems] = useState({}); // Status expand/collapse
  const [selectedMenu, setSelectedMenu] = useState(null); // Menu yang dipilih untuk form
  const [isExpandClicked, setIsExpandClicked] = useState(false);
  const [isCollapseClicked, setIsCollapseClicked] = useState(false);

  // Ambil data untuk dropdown dari API
  const fetchMenuOptions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/get-menu`
      );

      setMenuOptions(response.data);
    } catch (error) {
      console.error("Error fetching menu options:", error);
    }
  };

  // Ambil data detail menu berdasarkan menu_id dari API
  const fetchMenuData = async (menu_id) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/menu-hierarchy/${menu_id}`
      );
      setMenuData(response.data);
      setAllItems(flattenMenu(response.data));
    } catch (error) {
      console.error("Error fetching menu data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk meratakan menu hierarchy menjadi satu array untuk select option parent
  const flattenMenu = (items) => {
    let flatList = [];
    items.forEach((item) => {
      flatList.push(item);
      if (item.children_recursive) {
        flatList = flatList.concat(flattenMenu(item.children_recursive));
      }
    });
    return flatList;
  };

  // Fetch options saat komponen dimuat
  useEffect(() => {
    fetchMenuOptions();
  }, []);

  // Panggil fetchMenuData jika menu dipilih
  const handleMenuSelect = (event) => {
    const menu_id = event.target.value;
    setSelectedMenuId(menu_id);
    if (menu_id) {
      fetchMenuData(menu_id);
    }
  };

  // Expand all menu items
  const handleExpandAll = () => {
    setIsExpandClicked(true);
    setIsCollapseClicked(false);

    const expandedState = {};
    const expandAllItems = (items) => {
      items.forEach((item) => {
        if (item.children_recursive?.length > 0) {
          expandedState[item.id] = true;
          expandAllItems(item.children_recursive);
        }
      });
    };

    expandAllItems(menuData);
    setExpandedItems(expandedState);
  };

  // Collapse all menu items and hide form
  const handleCollapseAll = () => {
    setIsExpandClicked(false);
    setIsCollapseClicked(true);
    setExpandedItems({});
    setSelectedMenu(null); // Sembunyikan form saat collapse
  };

  // Fungsi untuk memilih menu dari tree
  const handleSelectMenu = (menu) => {
    setSelectedMenu(menu);
  };

  const handleMenuUpdate = async (updatedMenu) => {
    try {
      if (selectedMenuId) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/menu-items/${updatedMenu.id}`,
          updatedMenu
        );
        fetchMenuData(selectedMenuId);
      }
    } catch (error) {
      console.error("Error updating menu data:", error);
    }
  };

  const handleDelete = async (menuId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/menu-items/${menuId}`
      );
      fetchMenuData(selectedMenuId);
      setSelectedMenu(null); // Reset selectedMenu setelah menghapus
    } catch (error) {
      console.error("Error deleting menu data:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Loading indicator */}
      {isLoading && <Loader />}

      {/* Menu Tree and Form */}
      <div className="w-full md:w-1/2">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Menu
          </label>
          <select
            onChange={handleMenuSelect}
            value={selectedMenuId || ""}
            className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="">Select a menu</option>
            {menuOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-col md:flex-row mt-4">
        {/* Dropdown menu */}

        <div className="w-full md:w-1/2 p-4">
          {/* Expand and Collapse Buttons */}
          <div className="flex space-x-2 mt-4 mb-4">
            <Button
              onClick={handleExpandAll}
              className={`${
                isExpandClicked
                  ? "bg-black text-white"
                  : "bg-white text-black border border-black hover:bg-black hover:text-white"
              } w-full rounded-3xl font-bold`}
            >
              Expand All
            </Button>
            <Button
              onClick={handleCollapseAll}
              className={`${
                isCollapseClicked
                  ? "bg-black text-white"
                  : "bg-white text-black border border-black hover:bg-black hover:text-white"
              } w-full rounded-3xl font-bold`}
            >
              Collapse All
            </Button>
          </div>

          <div className="mt-4">
            <MenuTree
              data={menuData}
              onSelect={handleSelectMenu}
              expandedItems={expandedItems}
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 p-4 mt-4">
          {selectedMenu ? (
            <MenuForm
              selectedMenu={selectedMenu}
              allItems={allItems}
              onUpdate={handleMenuUpdate}
              onDelete={handleDelete}
            />
          ) : (
            <div className="text-gray-500 bg-white p-6 shadow rounded">
              <h2 className="text-lg font-semibold mb-2">Detail Menu</h2>
              <p>Select a menu to show and edit its details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
