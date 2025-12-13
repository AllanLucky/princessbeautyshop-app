import Products from "../components/Products"

const ProductList = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* FILTER & SORT SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">

        {/* LEFT: Filter Products & Popular Brands */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-wrap">
          <span className="text-lg font-semibold whitespace-nowrap">Filter Products</span>

          <select name="concern" className="p-2 border rounded-md min-w-[150px]">
            <option>Dry Skin</option>
            <option>Oily Skin</option>
            <option>Combination Skin</option>
            <option>Normal Skin</option>
            <option>Sensitive Skin</option>
            <option>Acne Prone</option>
            <option>Mature Skin</option>
            <option>Hyperpigmentation</option>
            <option>Redness</option>
            <option>Sun Damage</option>
            <option>Dehydrated Skin</option>
            <option>Dull Skin</option>
            <option>Uneven Texture</option>
            <option>Large Pores</option>
            <option>Blackheads</option>
            <option>Whiteheads</option>
            <option>Fine Lines</option>
            <option>Wrinkles</option>
            <option>Dark Circles</option>
            <option>Uneven Tone</option>
          </select>

          <select name="Popular Brand" className="p-2 border rounded-md min-w-[150px]">
            <option>Neutrogena</option>
            <option>Olay</option>
            <option>L'Oréal</option>
            <option>Garnier</option>
            <option>Clinique</option>
            <option>Maybelline</option>
            <option>Estée Lauder</option>
            <option>Vichy</option>
            <option>Nivea</option>
            <option>La Roche-Posay</option>
            <option>Revlon</option>
            <option>Dove</option>
            <option>Biotherm</option>
            <option>Shiseido</option>
            <option>Avène</option>
            <option>Cetaphil</option>
            <option>Mary Kay</option>
            <option>Kiehl's</option>
            <option>Huda Beauty</option>
            <option>Fenty Beauty</option>
          </select>
        </div>

        {/* RIGHT: Sort Products */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 lg:mt-0">
          <span className="text-lg font-semibold whitespace-nowrap">Sort Products</span>
          <select name="Price" className="p-2 border rounded-md min-w-[150px]">
            <option value="newest">Newest</option>
            <option value="asc">Price (asc)</option>
            <option value="desc">Price (desc)</option>
          </select>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <Products />
    </div>
  )
}

export default ProductList
