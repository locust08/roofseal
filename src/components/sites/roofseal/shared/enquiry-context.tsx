"use client";
import { createContext, useContext } from "react";

export const EnquiryContext = createContext<() => void>(() => {});
export const useEnquiry = () => useContext(EnquiryContext);
