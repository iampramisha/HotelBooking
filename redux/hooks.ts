import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";

//use throughout app instead of plain useDispatch and useSelector
export const useAppDispatch=()=>useDispatch<AppDispatch>();
export const useAppSelector:  TypedUseSelectorHook<RootState>=useSelector
//so we dont have to type dispatch everywhere
//componenets ma esari access gare huncha aba instead mathi jasari everytime
//   const count = useAppSelector((state) => state.user.value);
//   const dispatch = useAppDispatch();
