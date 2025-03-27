// // import React from "react";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// // import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// // import { Users, Settings, Database, Shield } from "lucide-react";

// // const AdminPanel: React.FC = () => {
// //   return (
// //     <div className="p-6">
// //       <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
// //       <Tabs defaultValue="users" className="w-full">
// //         <TabsList className="mb-4">
// //           <TabsTrigger value="users">
// //             <Users className="mr-2" /> Users
// //           </TabsTrigger>
// //           <TabsTrigger value="settings">
// //             <Settings className="mr-2" /> Settings
// //           </TabsTrigger>
// //           <TabsTrigger value="databases">
// //             <Database className="mr-2" /> Databases
// //           </TabsTrigger>
// //           <TabsTrigger value="roles">
// //             <Shield className="mr-2" /> Roles & Permissions
// //           </TabsTrigger>
// //         </TabsList>
        
// //         <TabsContent value="users">
// //           <Card>
// //             <CardContent>
// //               <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
// //               <Table>
// //                 <TableHeader>
// //                   <TableRow>
// //                     <TableHead>ID</TableHead>
// //                     <TableHead>Name</TableHead>
// //                     <TableHead>Email</TableHead>
// //                     <TableHead>Role</TableHead>
// //                     <TableHead>Actions</TableHead>
// //                   </TableRow>
// //                 </TableHeader>
// //                 <TableBody>
// //                   <TableRow>
// //                     <TableCell>1</TableCell>
// //                     <TableCell>John Doe</TableCell>
// //                     <TableCell>john@example.com</TableCell>
// //                     <TableCell>Admin</TableCell>
// //                     <TableCell>
// //                       <Button variant="destructive" size="sm">Delete</Button>
// //                     </TableCell>
// //                   </TableRow>
// //                 </TableBody>
// //               </Table>
// //             </CardContent>
// //           </Card>
// //         </TabsContent>
        
// //         <TabsContent value="settings">
// //           <Card>
// //             <CardContent>
// //               <h2 className="text-xl font-semibold mb-4">Application Settings</h2>
// //               <Button variant="default">Update Settings</Button>
// //             </CardContent>
// //           </Card>
// //         </TabsContent>

// //         <TabsContent value="databases">
// //           <Card>
// //             <CardContent>
// //               <h2 className="text-xl font-semibold mb-4">Manage Databases</h2>
// //               <Button variant="default">Connect New Database</Button>
// //             </CardContent>
// //           </Card>
// //         </TabsContent>

// //         <TabsContent value="roles">
// //           <Card>
// //             <CardContent>
// //               <h2 className="text-xl font-semibold mb-4">Roles & Permissions</h2>
// //               <Button variant="default">Modify Permissions</Button>
// //             </CardContent>
// //           </Card>
// //         </TabsContent>
// //       </Tabs>
// //     </div>
// //   );
// // };

// // export default AdminPanel;

// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// export default function AdminPanel() {
//   return (
//     <div>
//       <Card>
//         <CardContent>
//           <Tabs defaultValue="account">
//             <TabsList>
//               <TabsTrigger value="account">Account</TabsTrigger>
//               <TabsTrigger value="settings">Settings</TabsTrigger>
//             </TabsList>
//             <TabsContent value="account">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Name</TableHead>
//                     <TableHead>Role</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   <TableRow>
//                     <TableCell>John Doe</TableCell>
//                     <TableCell>Admin</TableCell>
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             </TabsContent>
//           </Tabs>
//           <Button>Save</Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }