import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "@/store/admin/dashboard-slice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Package, Users, Eye } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { dashboardStats, isLoading, error } = useSelector((state) => state.adminDashboard);

    useEffect(() => {
        dispatch(fetchDashboardStats());
    }, [dispatch]);

    console.log('Dashboard State:', { dashboardStats, isLoading, error });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Error: {error}</p>
                    <Button onClick={() => dispatch(fetchDashboardStats())}>Retry</Button>
                </div>
            </div>
        );
    }

    if (!dashboardStats) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <p className="text-muted-foreground mb-4">No data available</p>
                    <Button onClick={() => dispatch(fetchDashboardStats())}>Load Dashboard</Button>
                </div>
            </div>
        );
    }

    const { totalSales, totalOrders, totalProducts, totalUsers, salesStatistics, productsStatistics, recentOrders } = dashboardStats;

    // Colors for pie chart
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Format date
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: '2-digit'
        });
    };

    return (
        <div className="p-6 space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Welcome to your admin dashboard</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Sales</CardTitle>
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">${totalSales}</div>
                        <p className="text-xs text-muted-foreground mt-1">Total revenue from all orders</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <ShoppingCart className="h-5 w-5 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{totalOrders}</div>
                        <p className="text-xs text-muted-foreground mt-1">Total number of orders</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
                        <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                            <Package className="h-5 w-5 text-yellow-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{totalProducts}</div>
                        <p className="text-xs text-muted-foreground mt-1">Products in inventory</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <Users className="h-5 w-5 text-purple-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{totalUsers}</div>
                        <p className="text-xs text-muted-foreground mt-1">Registered customers</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Sales Statistics */}
                <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">
                            Sale statistics - {salesStatistics?.year || new Date().getFullYear()}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={salesStatistics?.quarters || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="quarter"
                                    label={{ value: 'QUARTER', position: 'insideBottom', offset: -5 }}
                                />
                                <YAxis label={{ value: 'TOTAL SALES', angle: -90, position: 'insideLeft' }} />
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend
                                    payload={[
                                        { value: 'Sales Amount', type: 'square', color: '#FF8042' }
                                    ]}
                                />
                                <Bar dataKey="amount" fill="#FF8042" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Products Statistics */}
                <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Products by Category</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        {productsStatistics && productsStatistics.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={productsStatistics}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={false}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {productsStatistics.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value, name, props) => [
                                            `${value} products`,
                                            props.payload.name
                                        ]}
                                    />
                                    <Legend
                                        verticalAlign="middle"
                                        align="right"
                                        layout="vertical"
                                        iconType="circle"
                                        formatter={(value, entry) => {
                                            const item = entry.payload;
                                            const percent = ((item.value / productsStatistics.reduce((sum, i) => sum + i.value, 0)) * 100).toFixed(1);
                                            return `${item.name}: ${item.value} (${percent}%)`;
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                                No product data available
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* New Orders Table */}
            <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">New orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentOrders && recentOrders.length > 0 ? (
                                recentOrders.map((order) => (
                                    <TableRow key={order.id} className="hover:bg-gray-50">
                                        <TableCell className="font-mono text-sm">{order.id.slice(0, 16)}...</TableCell>
                                        <TableCell>{order.email}</TableCell>
                                        <TableCell className="font-semibold">{formatCurrency(order.amount)}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={order.status === 'paid' ? 'default' : 'destructive'}
                                                className={order.status === 'paid' ? 'bg-green-500 hover:bg-green-600' : ''}
                                            >
                                                {order.status === 'paid' ? 'PAID' : 'NOT PAID'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{formatDate(order.date)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => navigate(`/admin/orders`)}
                                                className="hover:bg-blue-50"
                                            >
                                                <Eye className="h-4 w-4 text-blue-600" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No orders found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

export default AdminDashboard;