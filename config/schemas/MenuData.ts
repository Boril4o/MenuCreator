import {RawItem} from "@/config/schemas/menupage";

export type MenuItem = RawItem & { id: string };          // crypto.randomUUID()

export type MenuCategory = {
    id: string;
    name: string;
    items: MenuItem[];
};

export type MenuData = {
    language: string | null;
    currency: string | null;
    notes: string[];
    categories: MenuCategory[];
};