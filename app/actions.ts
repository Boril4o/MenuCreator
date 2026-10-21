// app/actions.ts
'use server';

import {menuReaderPrompt} from "@/prompts/menuReaderPrompt";
import {userMenuPrompt} from "@/prompts/userMenuPrompt";
import openai from "@/config/openai";
import {MenuPage, menuPageSchema} from "@/config/schemas/menupage";
import {MenuCategory, MenuData, MenuItem} from "@/config/schemas/MenuData";

export async function uploadMenuFiles(formData: FormData) {
    // Use .getAll() to retrieve an array of files
    const files = formData.getAll('files') as File[];

    if (!files || files.length == 0) {
        throw new Error("No file uploaded");
    }

    //TODO
    //check for different img file types
    //set limit of file being max 48MiB

    const menu = await convertFilesToMenu(files);
}

async function convertFilesToMenu(files: File[]): Promise<MenuData> {
    const languages: string[] = [];
    const currencies: string[] = [];
    const notes: string[] = [];
    const categories: MenuCategory[] = [];

    let lastCategory: string | null = null;
    for (const file of files) {
        // Convert the Web File object to a Node.js Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = buffer.toString("base64");

        try {
            const response = await openai.chat.completions.create({
                // DeepSeek's recommended multimodal model
                model: "deepseek-flash",

                // Force the output to be JSON
                response_format: { type: "json_object" },

                messages: [
                    {
                        role: "system",
                        content: menuReaderPrompt,
                    },
                    {
                        role: "user",
                        content: [
                            { type: "text", text: userMenuPrompt(lastCategory) },
                            {
                                type: "image_url",
                                image_url: {
                                    // Pass the base64 encoded image directly inline
                                    url: `data:image/jpeg;base64,${base64Image}`,
                                },
                            },
                        ],
                    },
                ],
            });

            // The response is guaranteed to be a JSON string, so we parse it
            const jsonOutput = response.choices[0].message.content;
            if (jsonOutput) {
                const parsedJson = JSON.parse(jsonOutput);

                const menuPage = menuPageSchema.parse(parsedJson) as MenuPage;
                lastCategory = menuPage.categories[menuPage.categories.length - 1].name;

                if (menuPage.language) {
                    languages.push(menuPage.language);
                }

                if (menuPage.currency) {
                    currencies.push(menuPage.currency);
                }

                notes.push(...menuPage.page_notes)

                for (const category of menuPage.categories) {
                    const items: MenuItem[] = category.items.map(item => ({
                        ...item,
                        id: crypto.randomUUID(),
                    }));

                    if (category.continues_from_previous_page && categories.length > 0) {
                        categories[categories.length - 1].items.push(...items);
                    }
                    else {
                        categories.push({
                            id: crypto.randomUUID(),
                            name: category.name,
                            items: items,
                        });
                    }
                }
            }
        } catch (error) {
            console.error("Error calling DeepSeek API:", error);
        }
    }

    return {
        language: null,
        currency: null,
        notes: notes,
        categories: categories,
    } as MenuData;
}