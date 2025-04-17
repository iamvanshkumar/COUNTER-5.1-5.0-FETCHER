import React, { useState } from 'react';

export default function SideBar() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (
        <>
            <div
                id="drawer-example"
                className={`fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform ${
                    isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
                } bg-white w-80 shadow-xl border-l border-gray-200`}
                tabIndex="-1"
                aria-labelledby="drawer-label"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white" id="drawer-label">
                        <i className="bx bxs-user-account"></i>
                        Add New Vendor 5.0
                    </h2>
                </div>
                <div className="flex space-x-4">
                    <button className="px-2 py-1 text-sm font-medium text-white bg-blue-500 rounded-md">
                        Counter 5.1
                    </button>
                    <button className="px-2 py-1 text-sm font-medium text-white bg-blue-500 rounded-md">
                        Counter 5
                    </button>
                </div>
                <a href="#" className="text-blue-500 underline">
                    Validate Vendor
                </a>
                <form className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Name*
                        </label>
                        <input
                            type="text"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Base URL*
                        </label>
                        <input
                            type="url"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Customer ID*
                        </label>
                        <input
                            type="text"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Requestor ID (Optional)
                        </label>
                        <input
                            type="text"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            API Key (Optional)
                        </label>
                        <input
                            type="text"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Platform (Optional)
                        </label>
                        <input
                            type="text"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Provider (Optional)
                        </label>
                        <input
                            type="text"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Starting Year (Optional)
                        </label>
                        <input
                            type="number"
                            defaultValue="2024"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Notes (Optional)
                        </label>
                        <textarea
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Does it require two attempts per report?*
                        </label>
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="twoAttempts"
                                    value="no"
                                    className="form-radio"
                                    required
                                />
                                <span className="ml-2">No</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="twoAttempts"
                                    value="yes"
                                    className="form-radio"
                                    required
                                />
                                <span className="ml-2">Yes</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Does it need requests throttled?*
                        </label>
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="throttled"
                                    value="no"
                                    className="form-radio"
                                    required
                                />
                                <span className="ml-2">No</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="throttled"
                                    value="yes"
                                    className="form-radio"
                                    required
                                />
                                <span className="ml-2">Yes</span>
                            </label>
                        </div>
                    </div>
                    </form>
                </div>
            </>
        );
}
