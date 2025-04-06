"use client"

import * as React from "react"
import {
    ColumnDef,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
    flexRender,
} from "@tanstack/react-table"

import { User } from "@/interfaces/User"
import { getUserService } from "@/services/user.service"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Dashboard() {
    const [data, setData] = React.useState<User[]>([])
    const [page, setPage] = React.useState(1)
    const [totalPages, setTotalPages] = React.useState(1)
    const [search, setSearch] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const [userToDelete, setUserToDelete] = React.useState<User | null>(null)
    const navigate = useNavigate()

    const fetchUsers = async () => {
        setIsLoading(true)
        try {
            const res = await getUserService.getAll(page, 10, search)
            setData(res.data)
            setTotalPages(res.totalPages)
        } catch {
            toast.error("Erro ao carregar usuários.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleEdit = (id?: string) => {
        if (!id) return
        navigate(`/usuario/${id}`)
    }

    const handleDeleteConfirm = async () => {
        if (!userToDelete) return
        try {
            await getUserService.delete(userToDelete.id)
            toast.success("Usuário deletado com sucesso")
            setUserToDelete(null)
            fetchUsers()
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message)
            } else {
                toast.error("Erro inesperado ao deletar usuário.")
            }
        }
    }

    React.useEffect(() => {
        fetchUsers()
    }, [page, search])

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: "name",
            header: "Nome",
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
        },
        {
            accessorKey: "role",
            header: "Tipo",
        },
        {
            accessorKey: "createdAt",
            header: "Criado em",
            cell: ({ row }) =>
                new Date(row.getValue("createdAt")).toLocaleDateString("pt-BR"),
        },
        {
            id: "actions",
            header: "Ações",
            cell: ({ row }) => {
                const user = row.original
                return (
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(user.id)}>
                            <Pencil className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setUserToDelete(user)}>
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                            </AlertDialogTrigger>
                        </AlertDialog>
                    </div>
                )
            }
        }
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        manualPagination: true,
        pageCount: totalPages,
        state: {
            pagination: {
                pageIndex: page - 1,
                pageSize: 10,
            },
        },
    })

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold font-syne ml-10 md:ml-0">Dashboard</h1>

            <section className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                        <Input
                            placeholder="Buscar por nome ou email..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                setPage(1)
                            }}
                        />
                    </div>
                    <Button onClick={() => navigate("/usuario")}>Adicionar Usuário</Button>
                </div>

                <div className="hidden sm:block rounded-md border overflow-x-auto">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="text-center">
                                        Carregando...
                                    </TableCell>
                                </TableRow>
                            ) : table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="text-center">
                                        Nenhum resultado encontrado.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="sm:hidden space-y-4">
                    {isLoading ? (
                        <p className="text-center text-sm text-gray-500">Carregando...</p>
                    ) : data.length > 0 ? (
                        data.map((user) => (
                            <Card key={user.id}>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">{user.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-1 text-sm text-muted-foreground">
                                    <p><span className="font-medium text-foreground">Email:</span> {user.email}</p>
                                    <p><span className="font-medium text-foreground">Tipo:</span> {user.role}</p>
                                    <p>
                                        <span className="font-medium text-foreground">Criado em:</span>{" "}
                                        {user.createdAt
                                            ? new Date(user.createdAt).toLocaleDateString("pt-BR")
                                            : "Data desconhecida"}
                                    </p>

                                    <div className="flex gap-2 pt-3">
                                        <Button variant="outline" size="icon" onClick={() => handleEdit(user.id)}>
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="outline" size="icon" onClick={() => setUserToDelete(user)}>
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </AlertDialogTrigger>
                                        </AlertDialog>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="text-center text-sm text-gray-500">Nenhum resultado encontrado.</p>
                    )}
                </div>


                <div className="flex items-center justify-between py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                    >
                        Anterior
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Página {page} de {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                    >
                        Próxima
                    </Button>
                </div>
            </section>

            {/* Modal de confirmação para deletar */}
            <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir <b>{userToDelete?.name}</b>?
                            Essa ação é irreversível.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
                            Confirmar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
