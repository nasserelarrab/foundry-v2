// HeaderToolbar.tsx (updated)
import {
  Search,
  Coffee,
  MessageSquareCode,
  Pin,
  ClipboardList,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, InputWrapper } from "@/components/ui/input";
import { useLayout } from "./context";

export function HeaderToolbar() {
  const { isMobile, toolbarContent } = useLayout(); // 👈 get toolbarContent

  const handleInputChange = () => {};

  return (
    <nav className="flex items-center gap-2.5">
      {/* Always present – left icons */}
      <Button mode="icon" variant="outline"><Coffee /></Button>
      <Button mode="icon" variant="outline"><MessageSquareCode /></Button>
      <Button mode="icon" variant="outline"><Pin /></Button>

      {/* Search – always present on non-mobile */}
      {/* {!isMobile && (
        <InputWrapper className="w-full lg:w-40">
          <Search />
          <Input type="search" placeholder="Search" onChange={handleInputChange} />
        </InputWrapper>
      )} */}

      {/* Right side – custom or default */}
      {toolbarContent}
    </nav>
  );
}