import { Wrench, Users, Settings, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { useCartStore } from "../../lib/store/cartStore";

interface TestOption {
    id: string;
    title: string;
    description: string;
    price: number;
    icon: React.ReactNode;
}

interface TestSelectionStepProps {
    selectedTestId: string | null;
    onSelectTest: (test: TestOption) => void;
    onNext: () => void;
}

export const TEST_OPTIONS: TestOption[] = [
    {
        id: "operative",
        title: "Operative Test",
        description: "Required for most trade-level CSCS cards including Labourer, Bricklayer, and Carpenter.",
        price: 22.50,
        icon: <Wrench className="w-6 h-6 text-[#ffbb16]" />
    },
    {
        id: "manager",
        title: "Manager & Professional",
        description: "Designed for project managers, site managers, and professional visitors (MAP).",
        price: 22.50,
        icon: <Users className="w-6 h-6 text-gray-500" />
    },
    {
        id: "plumbing",
        title: "Specialist: Plumbing",
        description: "For JIB plumbers and heating engineers requiring the JIB-specific safety test.",
        price: 22.50,
        icon: <Settings className="w-6 h-6 text-gray-500" />
    },
    {
        id: "electrical",
        title: "Specialist: Electrical",
        description: "Specifically for electricians and electrical technicians applying for ECS cards.",
        price: 22.50,
        icon: <Zap className="w-6 h-6 text-gray-500" />
    }
];

export function TestSelectionStep({ selectedTestId, onSelectTest, onNext }: TestSelectionStepProps) {
    const cartItems = useCartStore((state) => state.items);

    return (
        <div className="flex flex-col gap-8 w-full">
            <div className="flex flex-col gap-2">
                <h2 className="font-sans font-bold text-[36px] text-[#001430] leading-tight">
                    Select Your Test
                </h2>
                <p className="text-[#43474f] text-[16px]">
                    Choose the specific CITB Health, Safety & Environment test required for your CSCS card.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {TEST_OPTIONS.map((test) => {
                    const isSelected = selectedTestId === test.id;
                    const isAlreadyInCart = cartItems.some(item => item.id === test.id);
                    
                    return (
                        <div 
                            key={test.id}
                            onClick={() => {
                                if (!isAlreadyInCart) onSelectTest(test);
                            }}
                            className={`p-6 rounded-[16px] transition-all duration-200 border-2 flex flex-col gap-4 relative overflow-hidden
                                ${isAlreadyInCart 
                                    ? "border-[#001430] bg-slate-50 opacity-80 cursor-not-allowed" 
                                    : isSelected 
                                        ? "border-[#ffbb16] bg-white shadow-md cursor-pointer" 
                                        : "border-gray-100 bg-white hover:border-gray-300 cursor-pointer"
                                }
                            `}
                        >
                            {isAlreadyInCart && (
                                <div className="absolute top-0 right-0 bg-[#001430] text-white text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-[#ffbb16]" />
                                    Added to Cart
                                </div>
                            )}
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center
                                ${isAlreadyInCart ? "bg-[#001430]/10" : isSelected ? "bg-[#ffbb16]/10" : "bg-gray-100"}
                            `}>
                                {test.icon}
                            </div>
                            
                            <div className="flex flex-col gap-2 flex-1">
                                <h3 className="font-bold text-[#001430] text-[18px]">{test.title}</h3>
                                <p className="text-sm text-gray-500 line-clamp-3">{test.description}</p>
                            </div>

                            <div className="mt-4">
                                <span className="font-extrabold text-[24px] text-[#001430]">
                                    £{test.price.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-center md:justify-start mt-4">
                <button
                    onClick={onNext}
                    disabled={!selectedTestId}
                    className={`px-8 py-4 rounded-[8px] font-bold flex items-center gap-2 transition-colors
                        ${selectedTestId 
                            ? "bg-[#ffbb16] text-[#001430] hover:bg-[#e5a813]" 
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }
                    `}
                >
                    Continue to Schedule
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
