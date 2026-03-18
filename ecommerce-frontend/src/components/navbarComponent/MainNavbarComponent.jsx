import { useState, useEffect, useRef } from "react";
import NavLogo from "./NavLogo";
import NavAuthUserMenu from "./NavAuthUserMenu";
import { MdMenu, MdClose } from "react-icons/md";
import NavSearchBar from "./NavSearchBar";
import CustomNavLinks from "./CustomNavLinks";

const MainNavbarComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuRef = useRef(null);

 // To Handle the Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the mobile menu on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);

      // To Prevent the body scroll when menu is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav
      className={`sticky top-0 z-50 bg-[#131921] text-white border-b transition-shadow
 ${scrolled ? "shadow-md" : "shadow-sm"}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
        
          {/* Logo */}
          <NavLogo onClick={closeMenu} />

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 px-8">
            <NavSearchBar />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <CustomNavLinks />
            <div className="h-6 w-px bg-gray-300"></div>
            <NavAuthUserMenu />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 hover:text-indigo-600 focus:outline-none p-2 rounded-md hover:bg-gray-100 transition"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden fixed inset-x-0 top-16 bg-white border-t shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto"
        >
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <NavSearchBar />
            </div>

            {/* Mobile Navigation Links */}
            <CustomNavLinks onClick={closeMenu} isMobile={true} />

            {/* Mobile Auth Menu with Divider */}
            <div className="border-t pt-4 mt-4">
              <NavAuthUserMenu />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default MainNavbarComponent;
