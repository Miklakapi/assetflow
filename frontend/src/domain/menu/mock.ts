import type { MenuResponse } from './schema'

export function createMenuResponseMock(): MenuResponse {
    return {
        items: [
            {
                id: 'catalog',
                label: 'Catalog',
                icon: 'catalog',
                route: null,
                children: [
                    {
                        id: 'products',
                        label: 'Products',
                        icon: null,
                        route: '/products',
                        children: [],
                    },
                    {
                        id: 'assets',
                        label: 'Assets',
                        icon: null,
                        route: '/assets',
                        children: [],
                    },
                ],
            },
            {
                id: 'orders',
                label: 'Orders',
                icon: 'orders',
                route: '/orders',
                children: [],
            },
            {
                id: 'reservations',
                label: 'Reservations',
                icon: 'reservations',
                route: null,
                children: [
                    {
                        id: 'reservations-list',
                        label: 'Reservations',
                        icon: null,
                        route: '/reservations',
                        children: [],
                    },
                    {
                        id: 'reservations-calendar',
                        label: 'Calendar',
                        icon: null,
                        route: '/reservations/calendar',
                        children: [],
                    },
                ],
            },
            {
                id: 'dictionaries',
                label: 'Dictionaries',
                icon: 'dictionaries',
                route: null,
                children: [
                    {
                        id: 'categories',
                        label: 'Categories',
                        icon: null,
                        route: '/dictionaries/categories',
                        children: [],
                    },
                    {
                        id: 'brands',
                        label: 'Brands',
                        icon: null,
                        route: '/dictionaries/brands',
                        children: [],
                    },
                    {
                        id: 'manufacturers',
                        label: 'Manufacturers',
                        icon: null,
                        route: '/dictionaries/manufacturers',
                        children: [],
                    },
                    {
                        id: 'suppliers',
                        label: 'Suppliers',
                        icon: null,
                        route: '/dictionaries/suppliers',
                        children: [],
                    },
                    {
                        id: 'locations',
                        label: 'Locations',
                        icon: null,
                        route: '/dictionaries/locations',
                        children: [],
                    },
                    {
                        id: 'statuses',
                        label: 'Statuses',
                        icon: null,
                        route: '/dictionaries/statuses',
                        children: [],
                    },
                    {
                        id: 'units',
                        label: 'Units',
                        icon: null,
                        route: '/dictionaries/units',
                        children: [],
                    },
                    {
                        id: 'currencies',
                        label: 'Currencies',
                        icon: null,
                        route: '/dictionaries/currencies',
                        children: [],
                    },
                ],
            },
        ],
    }
}
