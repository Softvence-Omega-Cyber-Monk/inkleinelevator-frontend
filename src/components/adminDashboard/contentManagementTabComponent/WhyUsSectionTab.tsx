import {
  useGetHowItsForSectionQuery,
  useCreateHowItsForSectionMutation,
  useUpdateHowItsForSectionMutation,
  useCreateCardMutation,
  useUpdateCardMutation,
} from "@/Redux/features/AdminDashboard/contentManagement/howitsfor/howitsforApi";
import { useState, useEffect } from "react";
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

// Audience Card Component with Rich Text Editor
interface AudienceCardProps {
  audience: {
    audienceId?: string;
    type: string;
    cardTitle: string;
    cardSubtitle: string;
    bulletText: string;
  };
  title: string;
  index?: number;
  onCardTitleChange: (value: string) => void;
  onCardSubtitleChange: (value: string) => void;
  onBulletTextChange: (value: string) => void;
  onTypeChange?: (value: string) => void;
  onDelete?: () => void;
}

function AudienceCard({
  audience,
  title,
  onCardTitleChange,
  onCardSubtitleChange,
  onBulletTextChange,
  onTypeChange,
  onDelete,
}: AudienceCardProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Color,
      TextStyle,
      Placeholder.configure({
        placeholder: "Describe key elements...",
      }),
    ],
    content: audience.bulletText || "",
    onUpdate: ({ editor }) => {
      onBulletTextChange(editor.getHTML());
    },
  });

  // Update editor content when bulletText changes externally
  useEffect(() => {
    if (editor && editor.getHTML() !== audience.bulletText) {
      editor.commands.setContent(audience.bulletText || "");
    }
  }, [audience.bulletText, editor]);

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-700">{title}</h3>
        {onDelete && (
          <button
            onClick={onDelete}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Card"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="space-y-3">
        {onTypeChange && (
          <div>
            <label className="block text-xs text-gray-600 mb-1">Card Type</label>
            <select
              value={audience.type}
              onChange={(e) => {
                const newType = e.target.value;
                if (newType === "JOB_REQUESTER" || newType === "CONTRACTOR") {
                  onTypeChange(newType);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 text-sm"
            >
              <option value="JOB_REQUESTER">Job Requisitions</option>
              <option value="CONTRACTOR">Contractors</option>
            </select>
          </div>
        )}
        <div>
          <label className="block text-xs text-gray-600 mb-1">Card Title</label>
          <input
            type="text"
            value={audience.cardTitle}
            onChange={(e) => onCardTitleChange(e.target.value)}
            placeholder="Enter Your Answer (Ai)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Card Subtitle
          </label>
          <input
            type="text"
            value={audience.cardSubtitle}
            onChange={(e) => onCardSubtitleChange(e.target.value)}
            placeholder="G-r (Ans Elevator, our values to contribute..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Bullet Points
          </label>
          {editor && (
            <div className="rounded-lg border border-gray-300 bg-blue-50">
              <RichTextEditor editor={editor}>
                <RichTextEditor.Toolbar sticky stickyOffset={60}>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Underline />
                    <RichTextEditor.Strikethrough />
                    <RichTextEditor.Highlight />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.H1 />
                    <RichTextEditor.H2 />
                    <RichTextEditor.H3 />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.AlignLeft />
                    <RichTextEditor.AlignCenter />
                    <RichTextEditor.AlignRight />
                    <RichTextEditor.AlignJustify />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Link />
                    <RichTextEditor.Unlink />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.ColorPicker
                      colors={["#000000", "#e03131", "#2f9e44", "#1971c2"]}
                    />
                    <RichTextEditor.UnsetColor />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <button
                      type="button"
                      onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                      }
                      className="px-2 py-1 border rounded text-sm"
                    >
                      • Bullet
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                      }
                      className="px-2 py-1 border rounded text-sm"
                    >
                      1. Numbered
                    </button>
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Undo />
                    <RichTextEditor.Redo />
                  </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>

                <RichTextEditor.Content className="min-h-[150px] px-3 py-2" />
              </RichTextEditor>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function WhyUsSectionTab() {
  const { data, isLoading, refetch } = useGetHowItsForSectionQuery();
  const [createSection] = useCreateHowItsForSectionMutation();
  const [updateSection] = useUpdateHowItsForSectionMutation();
  const [createCard] = useCreateCardMutation();
  const [updateCard] = useUpdateCardMutation();

  const sectionData = data?.data;

  // Form state
  const [formData, setFormData] = useState({
    label: "",
    title: "",
    subtitle: "",
  });

  const [audienceCards, setAudienceCards] = useState<
    Array<{
      audienceId?: string;
      type: string;
      cardTitle: string;
      cardSubtitle: string;
      bulletText: string;
      title: string;
    }>
  >([]);

  // Set default values when data is fetched
  useEffect(() => {
    if (sectionData) {
      setFormData({
        label: sectionData.label || "",
        title: sectionData.title || "",
        subtitle: sectionData.subtitle || "",
      });

      // Set audience cards from API
      if (sectionData.audiences && Array.isArray(sectionData.audiences) && sectionData.audiences.length > 0) {
        // Count cards by type to create unique titles
        const typeCounts: { [key: string]: number } = {};
        
        const cards = sectionData.audiences.map((audience) => {
          const type = audience.type || "";
          const baseTitle = type === "JOB_REQUESTER" 
            ? "Job Requisitions" 
            : type === "CONTRACTOR"
            ? "Contractors"
            : `Card ${type}`;
          
          // Count how many of this type we've seen
          typeCounts[type] = (typeCounts[type] || 0) + 1;
          const count = typeCounts[type];
          
          // Add number suffix if there are multiple of the same type
          const title = count > 1 ? `${baseTitle} ${count}` : baseTitle;
          
          return {
            audienceId: audience.audienceId || "",
            type: type,
            cardTitle: audience.cardTitle || "",
            cardSubtitle: audience.cardSubtitle || "",
            bulletText: audience.bulletText || "",
            title: title,
          };
        });
        
        setAudienceCards(cards);
      } else {
        // Initialize with default cards if no audiences exist
        setAudienceCards([
          {
            type: "JOB_REQUESTER",
            cardTitle: "",
            cardSubtitle: "",
            bulletText: "",
            title: "Job Requisitions",
          },
          {
            type: "CONTRACTOR",
            cardTitle: "",
            cardSubtitle: "",
            bulletText: "",
            title: "Contractors",
          },
        ]);
      }
    }
  }, [sectionData]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle save
  const handleSave = async () => {
    try {
      // First, ensure section exists
      if (!sectionData) {
        // Create section first
        await createSection({
          label: formData.label,
          title: formData.title,
          subtitle: formData.subtitle,
        }).unwrap();
        toast.success("Section created successfully");
      } else {
        // Update section
        await updateSection({
          label: formData.label,
          title: formData.title,
          subtitle: formData.subtitle,
        }).unwrap();
      }

      // Save or update all audience cards
      for (const card of audienceCards) {
        // Validate type before saving
        if (card.type !== "JOB_REQUESTER" && card.type !== "CONTRACTOR") {
          toast.error(`Invalid card type: ${card.type}. Must be JOB_REQUESTER or CONTRACTOR.`);
          continue;
        }
        
        if (card.cardTitle.trim() || card.cardSubtitle.trim() || card.bulletText.trim()) {
          if (card.audienceId) {
            await updateCard({
              id: card.audienceId,
              data: {
                type: card.type,
                cardTitle: card.cardTitle,
                cardSubtitle: card.cardSubtitle,
                bulletText: card.bulletText,
              },
            }).unwrap();
          } else {
            await createCard({
              type: card.type,
              cardTitle: card.cardTitle,
              cardSubtitle: card.cardSubtitle,
              bulletText: card.bulletText,
            }).unwrap();
          }
        }
      }

      toast.success("Changes saved successfully!");
      refetch();
    } catch (error: any) {
      console.error("Failed to save changes:", error);
      toast.error(error?.data?.message || "Failed to save changes. Please try again.");
    }
  };

  // Handle reset
  const handleReset = () => {
    if (sectionData) {
      setFormData({
        label: sectionData.label || "",
        title: sectionData.title || "",
        subtitle: sectionData.subtitle || "",
      });

      if (sectionData.audiences && sectionData.audiences.length > 0) {
        const cards = sectionData.audiences.map((audience) => ({
          audienceId: audience.audienceId,
          type: audience.type,
          cardTitle: audience.cardTitle || "",
          cardSubtitle: audience.cardSubtitle || "",
          bulletText: audience.bulletText || "",
          title: audience.type === "JOB_REQUESTER" 
            ? "Job Requisitions" 
            : audience.type === "CONTRACTOR"
            ? "Contractors"
            : `Card ${audience.type}`,
        }));
        setAudienceCards(cards);
      } else {
        setAudienceCards([
          {
            type: "JOB_REQUESTER",
            cardTitle: "",
            cardSubtitle: "",
            bulletText: "",
            title: "Job Requisitions",
          },
          {
            type: "CONTRACTOR",
            cardTitle: "",
            cardSubtitle: "",
            bulletText: "",
            title: "Contractors",
          },
        ]);
      }
    } else {
      setFormData({
        label: "",
        title: "",
        subtitle: "",
      });
      setAudienceCards([
        {
          type: "JOB_REQUESTER",
          cardTitle: "",
          cardSubtitle: "",
          bulletText: "",
          title: "Job Requisitions",
        },
        {
          type: "CONTRACTOR",
          cardTitle: "",
          cardSubtitle: "",
          bulletText: "",
          title: "Contractors",
        },
      ]);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-4 md:p-6">
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold mb-2">
        Why Us?/For Section
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Manage what sets your service apart
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Label
          </label>
          <input
            type="text"
            name="label"
            value={formData.label}
            onChange={handleChange}
            placeholder="Provide services from trusted sub"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter the title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Subtitle
          </label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            placeholder="Write a short compelling thought"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>
      </div>

      {/* Audience Cards */}
      <div className="space-y-4 mb-4">
        {audienceCards.length === 0 && !isLoading && (
          <div className="text-center py-4 text-gray-500 text-sm">
            No audience cards found. Click "Add New Card" to create one.
          </div>
        )}
        {audienceCards.map((card, index) => (
          <AudienceCard
            key={card.audienceId || `card-${index}`}
            audience={card}
            title={card.title || `Card ${index + 1}`}
            index={index}
            onCardTitleChange={(value) => {
              const newCards = [...audienceCards];
              newCards[index].cardTitle = value;
              setAudienceCards(newCards);
            }}
            onCardSubtitleChange={(value) => {
              const newCards = [...audienceCards];
              newCards[index].cardSubtitle = value;
              setAudienceCards(newCards);
            }}
            onBulletTextChange={(value) => {
              const newCards = [...audienceCards];
              newCards[index].bulletText = value;
              setAudienceCards(newCards);
            }}
            onTypeChange={(value) => {
              const newCards = [...audienceCards];
              newCards[index].type = value;
              newCards[index].title = value === "JOB_REQUESTER" ? "Job Requisitions" : "Contractors";
              setAudienceCards(newCards);
            }}
            onDelete={
              audienceCards.length > 1
                ? () => {
                    const newCards = audienceCards.filter((_, i) => i !== index);
                    setAudienceCards(newCards);
                  }
                : undefined
            }
          />
        ))}
      </div>

      {/* Add New Card Button */}
      <div className="mb-6">
        <button
          onClick={() => {
            // Determine the type for the new card
            // Always use a valid type: JOB_REQUESTER or CONTRACTOR
            const hasJobRequester = audienceCards.some(card => card.type === "JOB_REQUESTER");
            const hasContractor = audienceCards.some(card => card.type === "CONTRACTOR");
            
            // Default to CONTRACTOR, but prefer JOB_REQUESTER if it doesn't exist
            let newType: "JOB_REQUESTER" | "CONTRACTOR" = "CONTRACTOR";
            if (!hasJobRequester) {
              newType = "JOB_REQUESTER";
            } else if (!hasContractor) {
              newType = "CONTRACTOR";
            } else {
              // Both types exist, default to CONTRACTOR
              newType = "CONTRACTOR";
            }
            
            // Ensure type is always valid
            if (newType !== "JOB_REQUESTER" && newType !== "CONTRACTOR") {
              newType = "CONTRACTOR";
            }
            
            const newTitle = newType === "JOB_REQUESTER" ? "Job Requisitions" : "Contractors";
            
            setAudienceCards([
              ...audienceCards,
              {
                type: newType,
                cardTitle: "",
                cardSubtitle: "",
                bulletText: "",
                title: newTitle,
              },
            ]);
          }}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm flex items-center gap-2"
        >
          <Plus size={16} />
          Add New Card
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Save Changes
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
}
