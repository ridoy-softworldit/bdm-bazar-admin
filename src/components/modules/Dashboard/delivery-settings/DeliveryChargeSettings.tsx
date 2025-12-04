"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import { Loader2, Save, Truck } from "lucide-react";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  IDeliveryCharge,
} from "@/redux/featured/settings/settingsApi";

const COURIERS = [
  { key: "steadfast", name: "Steadfast", color: "bg-blue-100 text-blue-800" },
  { key: "pathao", name: "Pathao", color: "bg-green-100 text-green-800" },
  { key: "redx", name: "RedX", color: "bg-red-100 text-red-800" },
  { key: "sundarban", name: "Sundarban", color: "bg-orange-100 text-orange-800" },
];

export default function DeliveryChargeSettings() {
  const { data: settingsData, isLoading: isFetching } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();

  const [deliveryCharge, setDeliveryCharge] = useState<IDeliveryCharge>({
    insideDhaka: {
      steadfast: 60,
      pathao: 65,
      redx: 70,
      sundarban: 55,
    },
    outsideDhaka: {
      steadfast: 100,
      pathao: 110,
      redx: 120,
      sundarban: 90,
    },
  });

  useEffect(() => {
    if (settingsData?.deliveryCharge && typeof settingsData.deliveryCharge === 'object') {
      setDeliveryCharge(settingsData.deliveryCharge as IDeliveryCharge);
    }
  }, [settingsData]);

  const handleChargeChange = (
    zone: "insideDhaka" | "outsideDhaka",
    courier: string,
    value: string
  ) => {
    const numValue = parseInt(value) || 0;
    setDeliveryCharge(prev => ({
      ...prev,
      [zone]: {
        ...prev[zone],
        [courier]: numValue,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      
      Object.entries(deliveryCharge.insideDhaka).forEach(([courier, charge]) => {
        formData.append(`deliveryCharge[insideDhaka][${courier}]`, charge.toString());
      });
      
      Object.entries(deliveryCharge.outsideDhaka).forEach(([courier, charge]) => {
        formData.append(`deliveryCharge[outsideDhaka][${courier}]`, charge.toString());
      });

      const result = await updateSettings(formData).unwrap();

      if (result.success) {
        toast.success("Delivery charges updated successfully!");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to update delivery charges!");
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Truck className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Delivery Charge Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-green-700">Inside Dhaka</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {COURIERS.map(({ key, name, color }) => (
              <div key={key} className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}>
                  {name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">৳</span>
                  <Input
                    type="number"
                    className="w-20 text-center"
                    value={deliveryCharge.insideDhaka[key as keyof typeof deliveryCharge.insideDhaka]}
                    onChange={(e) => handleChargeChange("insideDhaka", key, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-blue-700">Outside Dhaka</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {COURIERS.map(({ key, name, color }) => (
              <div key={key} className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}>
                  {name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">৳</span>
                  <Input
                    type="number"
                    className="w-20 text-center"
                    value={deliveryCharge.outsideDhaka[key as keyof typeof deliveryCharge.outsideDhaka]}
                    onChange={(e) => handleChargeChange("outsideDhaka", key, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Button onClick={handleSubmit} disabled={isUpdating} className="w-full">
        {isUpdating ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        Save Delivery Charges
      </Button>
    </div>
  );
}