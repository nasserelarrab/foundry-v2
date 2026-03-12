// import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
// import { Link } from "react-router-dom";

// export function HeaderTitle() {
//   return (
//     <div className="lg:px-0 flex flex-col items-start gap-0.5 mb-5 lg:mb-0">
//       <h1 className="text-base font-semibold">
//         Updates
//       </h1>
//       <Breadcrumb>
//         <BreadcrumbList>
//           <BreadcrumbItem>
//             <BreadcrumbLink href="/">Home</BreadcrumbLink>
//           </BreadcrumbItem>
//           <BreadcrumbSeparator className="text-xs text-muted-foreground">/</BreadcrumbSeparator>
//           <BreadcrumbItem>
//             <BreadcrumbLink asChild>
//               <Link to="/">Account</Link>
//             </BreadcrumbLink>
//           </BreadcrumbItem>
//           <BreadcrumbSeparator className="text-xs text-muted-foreground">/</BreadcrumbSeparator>
//           <BreadcrumbItem>
//             <BreadcrumbPage>Updates</BreadcrumbPage>
//           </BreadcrumbItem>
//         </BreadcrumbList>
//       </Breadcrumb>
//     </div>
//   );
// }

import { Link, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function HeaderTitle() {
  const location = useLocation();

  const pathnames = location.pathname.split('/').filter(Boolean);

  const crumbs = pathnames.map((segment, index) => {
    const path = '/' + pathnames.slice(0, index + 1).join('/');

    return {
      title: segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      path,
    };
  });

  const lastIndex = crumbs.length - 1;

  return (
    <div className="lg:px-0 flex flex-col items-start gap-0.5 mb-5 lg:mb-0">
      <h1 className="text-base font-semibold">
        {crumbs[lastIndex]?.title || 'Home'}
      </h1>

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
            {crumbs.length > 0 && (
              <BreadcrumbSeparator className="text-xs text-muted-foreground">
                /
              </BreadcrumbSeparator>
            )}
          </BreadcrumbItem>

          {crumbs.map((item, index) => (
            <BreadcrumbItem key={item.path}>
              {index === lastIndex ? (
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink asChild>
                    <Link to={item.path}>{item.title}</Link>
                  </BreadcrumbLink>

                  <BreadcrumbSeparator className="text-xs text-muted-foreground">
                    /
                  </BreadcrumbSeparator>
                </>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
