import { useEffect, React } from "react";
// Removed unused imports


export default function NavBar() {
    useEffect(() => {
        function updateDateTime() {
            const dateTimeElement = document.getElementById('date-time');
            const now = new Date();
            const formattedDateTime = now.toLocaleString();
            if (dateTimeElement) {
                dateTimeElement.textContent = formattedDateTime;
            }
        }
        const intervalId = setInterval(updateDateTime, 1000);
        updateDateTime();

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);
    return (
        <nav className="bg-white shadow-md border border-gray-200 z-10 sticky top-0 left-0 right-0">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-12 items-center justify-between">
                <div className="flex flex-1">
                    <div className="flex gap-2 shrink-0 items-center">
                        <img className="h-4 w-auto" draggable="false"
                            src="https://d12ux7ql5zx5ks.cloudfront.net/wp-content/uploads/MPS_LOGO_37df55fb0f6fe049cc780587d3693251-11.png"
                            alt="Your Company" />
                        <h1 className="text-sm text-gray-900 font-medium">Reports Fetcher - <span
                                className="text-red-400 text-sm text-normal ">v0.1.0</span></h1>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                    <i className='bx bx-calendar text-red-500'></i>
                    <p id="date-time" className=" font-semibold"></p>
                </div>
            </div>
        </div>
    </nav>
    );
};

