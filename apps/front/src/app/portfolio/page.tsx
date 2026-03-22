import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

function page() {
  return (
    <div>
      <Tooltip>
        <TooltipTrigger>
          <div className="w-full p-2 bg-gray-200 rounded-md">
            <Link href="/portfolio/my-posts">My Posts</Link>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>My Posts</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger>
          <Link href="/portfolio/create-post">Create Post</Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Create Post</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export default page;
