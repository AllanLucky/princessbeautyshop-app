const Footer = () => {
  return (
    <div className="bg-gray-100 px-6 md:px-20 lg:px-40 py-12">

      {/* MAIN SECTION */}
      <div className="flex flex-col md:flex-row justify-between gap-10">

        {/* LOGO + TEXT */}
        <div className="md:w-1/3 text-center md:text-left">
          <img src="/blisslogo1.png" alt="Logo" className="mx-auto md:mx-0" height={200} width={200} />
          <p className="mt-2 text-gray-600">
            LET`S MAKE YOUR SKIN FLOURISH WITH OUR PRODUCTS.
          </p>
        </div>

        {/* LINKS */}
        <div className="md:w-1/4 text-center md:text-left">
          <h3 className="text-xl font-semibold">Quick Links</h3>
          <ul className="mt-2 space-y-2">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">About Us</a></li>
            <li><a href="#" className="hover:underline">Shop</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div className="md:w-1/3 text-center md:text-left">
          <h3 className="text-xl font-semibold">Contact Us</h3>
          <p className="mt-2">123 BeautyBliss Ave, City, Country</p>
          <p className="mt-2">Phone: (123) 788425000</p>
          <p className="mt-2">Email: info@beautybliss.com</p>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="mt-10 border-t-4 border-[#e9acd9] pt-4 text-center">
        <p>&copy; 2024 BeautyBliss. All rights reserved.</p>

        <div className="flex justify-center space-x-4 mt-4">
          {/* GitHub */}
          <a href="#" className="hover:text-red-400">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.372 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577 0-.285-.01-1.04-.016-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.238 1.84 1.238 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.304.762-1.604-2.665-.305-5.466-1.334-5.466-5.933 0-1.31.468-2.382 1.236-3.222-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.984-.398 3.003-.404 1.02.006 2.047.138 3.006.404 2.29-1.552 3.296-1.23 3.296-1.23.655 1.653.243 2.874.12 3.176.77.84 1.234 1.912 1.234 3.222 0 4.61-2.804 5.625-5.475 5.921.43.372.815 1.102.815 2.222 0 1.604-.014 2.896-.014 3.287 0 .32.216.694.825.576C20.565 21.796 24 17.302 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
          </a>

          {/* Twitter */}
          <a href="#" className="hover:text-red-400">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557a9.828 9.828 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.865 9.865 0 01-3.127 1.195 4.916 4.916 0 00-8.384 4.482A13.944 13.944 0 011.671 3.15a4.916 4.916 0 001.523 6.573 4.897 4.897 0 01-2.228-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.923 4.923 0 004.598 3.417A9.867 9.867 0 010 19.54a13.94 13.94 0 007.548 2.212c9.058 0 14.01-7.514 14.01-14.01 0-.213-.005-.425-.014-.636A10.012 10.012 0 0024 4.557z" />
            </svg>
          </a>

          {/* Facebook */}
          <a href="#" className="hover:text-red-400">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.675 0h-21.35C.595 0 0 .593 0 1.326v21.348C0 23.406.595 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.466.098 2.797.142v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.762v2.31h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.324-.594 1.324-1.326V1.326C24 .593 23.405 0 22.675 0z" />
            </svg>
          </a>
        </div>
      </div>

    </div>
  );
};

export default Footer;
