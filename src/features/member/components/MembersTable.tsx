import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowSelectionState,
} from "@tanstack/react-table";
import {
  Eye,
  EyeOff,
  CheckCircle,
  Info,
  Loader2,
  SendIcon,
} from "lucide-react";
import { useState, useMemo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { User } from "../types";
import { MemberDetailDialog } from "./MemberDialog";

interface MembersTableProps {
  data: User[];
  isLoading: boolean;
  onValidate: (uniqueNumber: string[]) => void;
  onSendDefaultPassword: (users_id: string[]) => void;
}

export function MembersTable({
  data,
  isLoading,
  onValidate,
  onSendDefaultPassword,
}: MembersTableProps) {
  const [emailVisibility, setEmailVisibility] = useState<{
    [key: string]: boolean;
  }>({});

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const columnHelper = createColumnHelper<User>();

  const maskEmail = (email: string) => {
    if (!email) return "-";
    const parts = email.split("@");
    if (parts.length < 2) return email;

    const [localPart, domain] = parts;
    if (localPart.length <= 3) return `***@${domain}`;
    return `${localPart[0]}***${localPart.slice(-1)}@${domain}`;
  };

  const handleSeeDetail = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleBulkValidate = () => {
    const selectedUsers = table
      .getSelectedRowModel()
      .flatRows.map((row) => row.original);

    const uniqueNumbers = selectedUsers.map((user) => user.unique_number);

    if (uniqueNumbers.length > 0) {
      onValidate(uniqueNumbers);
    }

    setRowSelection({});
  };

  const handleBulkSendDefaultPassword = () => {
    const selectedUsers = table
      .getSelectedRowModel()
      .flatRows.map((row) => row.original);

    const userIds = selectedUsers.map((user) => user.id);

    if (userIds.length > 0) {
      onSendDefaultPassword(userIds);
    }

    setRowSelection({});
  };

  const columns = [
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
          title="Select all"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
          title="Select row"
        />
      ),
      size: 50,
      enableResizing: false,
    }),

    columnHelper.accessor(() => null, {
      header: "No",
      cell: (info) => info.row.index + 1,
      size: 50,
    }),
    columnHelper.accessor("unique_number", {
      header: "Unique Number",
      cell: (info) => info.getValue() || "-",
      size: 150,
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => {
        const email = info.getValue();

        const userId = info.row.original.id;

        if (!email) return "-";

        return (
          <div className="flex items-center gap-2">
            <span>{emailVisibility[userId] ? email : maskEmail(email)}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() =>
                setEmailVisibility((prev) => ({
                  ...prev,
                  [userId]: !prev[userId],
                }))
              }
            >
              {emailVisibility[userId] ? (
                <EyeOff className="h-3 w-3" />
              ) : (
                <Eye className="h-3 w-3" />
              )}
              <span className="sr-only">
                {emailVisibility[userId] ? "Hide email" : "Show email"}
              </span>
            </Button>
          </div>
        );
      },
      size: 250,
    }),
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => info.getValue() || "-",
      size: 200,
    }),

    columnHelper.accessor((row) => row.is_active, {
      id: "status_active",
      header: "Status",
      cell: (info) =>
        info.getValue() ? (
          <span className="text-green-600 font-medium">Active</span>
        ) : (
          <span className="text-red-600 font-medium">Inactive</span>
        ),
    }),
    columnHelper.accessor((row) => row.is_validate, {
      id: "status_validate",
      header: "Validasi",
      cell: (info) =>
        info.getValue() ? (
          <span className="text-blue-600 font-medium">Validated</span>
        ) : (
          <span className="text-yellow-600 font-medium">Pending</span>
        ),
    }),

    columnHelper.display({
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: (info) => {
        const user = info.row.original;
        const isFullyActive = user.is_active && user.is_validate;

        return (
          <div className="flex justify-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 p-2 text-blue-600 hover:text-blue-800"
                    onClick={() => handleSeeDetail(user)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Lihat Detail Anggota</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 p-2 text-green-600 hover:text-green-800"
                    onClick={() => onSendDefaultPassword([user.id])}
                  >
                    <SendIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Kirim Default Password (Satuan)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {!user.is_validate && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onValidate([user.unique_number])}
                      disabled={isLoading}
                      className="flex items-center gap-2 h-8"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Validate
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Validate Member (Satuan)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        );
      },
      size: 200,
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),

    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  const selectedRowsCount = table.getSelectedRowModel().flatRows.length;
  const hasSelected = selectedRowsCount > 0;

  const isAnySelectedValidated = useMemo(() => {
    if (!hasSelected) return false;

    const selectedUsers = table
      .getSelectedRowModel()
      .flatRows.map((row) => row.original);

    return selectedUsers.some((user) => user.is_validate);
  }, [rowSelection, data, hasSelected]);

  const bulkValidateTooltip = isAnySelectedValidated
    ? "Salah satu anggota yang dipilih sudah tervalidasi."
    : "Validasi semua anggota yang dipilih.";

  if (isLoading) {
    return (
      <div className="rounded-md border p-12 w-full flex items-center justify-center bg-background/50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Sedang memuat data anggota...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 p-4 bg-white dark:bg-gray-800 rounded-xl border shadow-sm">
        <span className="text-base font-medium text-gray-700 dark:text-gray-200 mb-2 sm:mb-0">
          {selectedRowsCount} Anggota terpilih
        </span>
        <div className="flex flex-wrap justify-end gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleBulkValidate}
                  disabled={!hasSelected || isLoading || isAnySelectedValidated}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white transition duration-200 shadow-md"
                >
                  <CheckCircle className="h-4 w-4" />
                  Bulk Validate ({selectedRowsCount})
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{bulkValidateTooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            onClick={handleBulkSendDefaultPassword}
            disabled={!hasSelected || isLoading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition duration-200 shadow-md"
            title="Kirim Default Password ke semua anggota yang dipilih"
          >
            <SendIcon className="h-4 w-4" />
            Bulk Send Password ({selectedRowsCount})
          </Button>
        </div>
      </div>

      <div className="rounded-xl border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className="font-semibold py-4 px-4 whitespace-nowrap"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-3 px-4 whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-40 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Info className="h-10 w-10 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Tidak ada data anggota yang ditemukan.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <MemberDetailDialog
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
