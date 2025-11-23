"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  ArrowUpDown,
  X,
  Calendar,
  ImageIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetAllbrandsQuery } from "@/redux/featured/brands/brandsApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const BrandManagement = () => {
  const { data: allBrands, isLoading } = useGetAllbrandsQuery();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<any | null>(null);

  const handleClick = () => {
    router.push("/admin/add-brand");
  };

  // Filter brands
  const filteredBrands = (allBrands || []).filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 py-6 px-4 sm:px-6 md:px-8 bg-gray-50 min-h-screen">
      {/* Header Button */}
      <div className="flex justify-end">
        <Button
          className="bg-gray-800 hover:bg-gray-900 text-white shadow-md"
          onClick={handleClick}
        >
          + Add Brand
        </Button>
      </div>

      {/* Brand Management */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Brand Management
          </h2>
          <p className="text-gray-500 text-sm">
            Manage your product brands and suppliers
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search here..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Sort
            </Button>
          </div>
        </div>

        {/* Brand Grid */}
        {isLoading ? (
          <p className="text-gray-500">Loading brands...</p>
        ) : filteredBrands.length === 0 ? (
          <p className="text-gray-500">No brands found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBrands.map((brand) => (
              <Card
                key={brand._id}
                className="overflow-hidden rounded-xl shadow-sm border hover:shadow-lg transition-all"
              >
                {/* Header */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                  <Image
                    src={brand.icon?.url}
                    alt={brand.icon?.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-lg object-contain bg-gray-100 p-1"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {brand.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Created:{" "}
                      {new Date(brand.createdAt).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                </div>

                {/* Images */}
                {brand.images?.length > 0 && (
                  <div className="flex gap-2 p-4 overflow-x-auto">
                    {brand.images.map((img, idx) => (
                      <Image
                        key={idx}
                        src={img.image}
                        alt={`${brand.name}-${img.layout}`}
                        width={96}
                        height={96}
                        className="w-24 h-24 object-cover rounded-md border"
                      />
                    ))}
                  </div>
                )}

                {/* Footer */}
                <CardContent className="flex justify-between items-center p-4 pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      router.push(`/admin/edit-brand/${brand._id}`)
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setSelectedBrand(brand)}
                  >
                    View
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Modal for Brand Details */}
      <Dialog
        open={!!selectedBrand}
        onOpenChange={() => setSelectedBrand(null)}
      >
        <DialogContent className="max-w-lg sm:max-w-xl rounded-xl bg-white shadow-2xl">
          <DialogHeader className="flex justify-between items-center mb-4">
            <DialogTitle className="text-lg font-semibold text-gray-800">
              {selectedBrand?.name}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-gray-600 text-sm mb-4">
            Brand details and images
          </DialogDescription>

          {selectedBrand && (
            <div className="space-y-4">
              {/* Icon */}
              <div className="flex items-center gap-3">
                <ImageIcon className="text-gray-500 w-4 h-4" />
                <Image
                  src={selectedBrand.icon?.url}
                  alt={selectedBrand.icon?.name}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-lg border bg-gray-100 object-contain p-1"
                />
                <div>
                  <p className="text-sm text-gray-700">
                    Icon Name: {selectedBrand.icon?.name}
                  </p>
                </div>
              </div>

              {/* Created At */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <p>
                  Created at:{" "}
                  {new Date(selectedBrand.createdAt).toLocaleString("en-GB")}
                </p>
              </div>

              {/* Images */}
              {selectedBrand.images?.length > 0 && (
                <div>
                  <p className="font-medium text-gray-800 mb-2">
                    Brand Images:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {selectedBrand.images.map(
                      (img: { image: string }, idx: number) => (
                        <Image
                          key={idx}
                          src={img.image}
                          alt={`brand-${idx}`}
                          width={112}
                          height={112}
                          className="w-28 h-28 object-cover rounded-lg border"
                        />
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button
              variant="outline"
              onClick={() => setSelectedBrand(null)}
              className="text-gray-600 border-gray-300"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrandManagement;
