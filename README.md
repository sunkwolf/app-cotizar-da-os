# MUTUALIDAD PROTEG-RT - Cotizador de Daños

Aplicación móvil para cotizar reparaciones de vehículos en siniestros.

## Descripción

Esta aplicación permite a los ajustadores de MUTUALIDAD PROTEG-RT crear cotizaciones para la reparación de vehículos dañados en siniestros, diferenciando entre:

- **Cotizaciones para Contraparte**: Precios más económicos
- **Cotizaciones para Cliente**: Precios con margen de negociación (+20%)

## Precios de Laminado y Pintura

### Para Contraparte
| Años del vehículo | Precio por pieza |
|-------------------|------------------|
| Actual +1 a 4 años atrás | $2,000 MXN |
| 5 a 15 años atrás | $1,500 MXN |
| Más de 16 años | $1,200 MXN |

### Para Cliente
| Años del vehículo | Precio por pieza |
|-------------------|------------------|
| Actual +1 a 4 años atrás | $2,500 MXN |
| 5 a 15 años atrás | $2,000 MXN |
| Más de 16 años | $1,700 MXN |

## Piezas de Reemplazo

- **Contraparte**: Cotizar al menor costo en Mercado Libre
- **Cliente**: Cotizar al costo de la media en Mercado Libre

## Tecnologías

- React Native con Expo
- TypeScript
- React Navigation
- TigerData (Base de datos - pendiente de integración)

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npx expo start

# Iniciar para Android
npx expo start --android

# Iniciar para Web (desarrollo)
npx expo start --web
```

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── LaminadoPinturaModal.tsx
│   └── AddReplacementPartModal.tsx
├── constants/           # Constantes y configuración
│   ├── colors.ts
│   └── vehicleParts.ts
├── navigation/          # Configuración de navegación
│   └── AppNavigator.tsx
├── screens/             # Pantallas de la aplicación
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── QuotationsPanelScreen.tsx
│   ├── NewQuotationTypeScreen.tsx
│   ├── NewQuotationDetailsScreen.tsx
│   └── QuotationSummaryScreen.tsx
├── types/               # Definiciones de TypeScript
│   └── index.ts
└── utils/               # Utilidades (pendiente)
```

## Funcionalidades Pendientes

- [ ] Integración con TigerData
- [ ] Autenticación de usuarios
- [ ] Aprobación de usuarios por admin
- [ ] Generación de PDF
- [ ] Búsqueda en Mercado Libre API
- [ ] Notificaciones push

## Autor

MUTUALIDAD PROTEG-RT A.C.
