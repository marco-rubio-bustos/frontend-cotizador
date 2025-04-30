import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  BlobProvider,
} from '@react-pdf/renderer'
import { FormattedThousands } from '../misc/FormattedNumber'
import FormattedRut from '../misc/FormattedRut'

const styles = StyleSheet.create({
  image: {
    width: 70,
    paddingRight: 5,
  },
  page: { padding: 20 },
  section: { marginBottom: 0 },
  title: { fontSize: 16, paddingBottom: 20 },
  boldText: { fontWeight: 'bold' },
  text: { fontSize: 9, paddingBottom: 4 },
  capitalize: { textTransform: 'capitalize' },
  textRight: { textAlign: 'right' },
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 0,
  },
  paddingTop_5: { paddingTop: 5 },
  paddingTop_10: { paddingTop: 10 },
  paddingBottom: { paddingBottom: 10 },
  borderWidth: {
    borderWidth: 1,
  },
  borderLeftWidth: {
    borderLeftWidth: 0,
  },
  borderRightWidth: {
    borderRightWidth: 1,
  },
  borderTopWidth: {
    borderTopWidth: 0,
  },
  boxCompany: {
    width: 350,
    //borderWidth: 1,
    padding: 0,
    //justifyContent: 'center',
    //alignItems: 'center',
  },
  boxQuotation: {
    width: 150,
    padding: 0,
    //justifyContent: 'center',
    alignItems: 'center',
  },
  boxInfo: {
    borderWidth: 1,
    padding: 5,
    fontSize: 10,
    borderRightWidth: 0,
    //justifyContent: 'center',
    //alignItems: 'center',
  },
  boxInfoItem: {
    width: 30,
  },
  boxInfoPrice: {
    width: 70,
  },
  boxInfoCustomerField: {
    width: 100,
  },
  boxInfoNotes: {
    width: 150,
  },
  boxInfoDescription: {
    width: 180,
  },
  boxInfoCustomerSmall: {
    width: 185,
  },
  boxInfoPriceTotal: {
    width: 280,
  },
  boxInfoNotesGral: {
    width: 390,
  },
  boxInfoCustomer: {
    width: 470,
  },
})

const PdfPrevia = ({
  quotation,
  customer,
  quotations,
  subTotal,
  iva,
  total,
}: {
  quotation: number
  customer: {
    name: string
    address: string
    rut: string
    attention: string
    phone: string
    email: string
    notesGeneral: string
  }
  quotations: {
    id: string
    description: string
    qty: string
    priceUnit: string
    total: string
    notes: string
  }[]
  subTotal: number
  iva: number
  total: number
}) => {
  return (
    <BlobProvider
      document={
        <Document>
          <Page size="LETTER" style={styles.page}>
            {/* Información sobre la Empresa */}
            <View style={[styles.container, styles.paddingBottom]}>
              <View>
                <Image
                  src="src/components/img/etiquetando.png"
                  style={styles.image}
                />
              </View>
              <View style={styles.boxCompany}>
                <Text style={[styles.text, styles.boldText]}>
                  COMERCIALIZADORA Y DISTRIBUIDORA DANIEL CHAPARRO E.I.R.L.
                </Text>
                <Text style={styles.text}>
                  Comercialización de Etiquetas, Artículos de Oficina,
                  Computación y Servicios Afines
                </Text>
                <Text style={styles.text}>
                  Dirección: Colbún 4386, Puente Alto, Región Metropolitana
                </Text>
                <Text style={styles.text}>
                  Fonos: (02) 3580415 - (09) 63410833
                </Text>
                <Text style={styles.text}>
                  www.etiquetando.cl - contacto@etiquetando.cl
                </Text>
              </View>
              <View style={styles.boxQuotation}>
                <Text style={styles.title}>Cotización N° {quotation}</Text>
                <Text style={styles.text}>
                  Fecha de Emisión:
                  {new Date().toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </Text>
              </View>
            </View>
            {/* Información sobre el Cliente */}
            <View style={[styles.container, styles.paddingBottom]}>
              <View style={[styles.boxInfo, styles.boxInfoCustomerField]}>
                <Text>Cliente</Text>
              </View>
              <View
                style={[
                  styles.boxInfo,
                  styles.boxInfoCustomer,
                  styles.borderRightWidth,
                  styles.capitalize,
                ]}
              >
                <Text>{customer.name}</Text>
              </View>
              <View
                style={[
                  styles.boxInfo,
                  styles.boxInfoCustomerField,
                  styles.borderTopWidth,
                ]}
              >
                <Text>Dirección</Text>
              </View>
              <View
                style={[
                  styles.boxInfo,
                  styles.boxInfoCustomer,
                  styles.borderRightWidth,
                  styles.borderTopWidth,
                  styles.capitalize,
                ]}
              >
                <Text>{customer.address}</Text>
              </View>
              <View
                style={[
                  styles.boxInfo,
                  styles.boxInfoCustomerField,
                  styles.borderTopWidth,
                ]}
              >
                <Text>Rut</Text>
              </View>
              <View
                style={[
                  styles.boxInfo,
                  styles.boxInfoCustomerSmall,
                  styles.borderTopWidth,
                ]}
              >
                <Text>
                  <FormattedRut rut={customer.rut} />
                </Text>
              </View>
              <View
                style={[
                  styles.boxInfo,
                  styles.boxInfoCustomerField,
                  styles.borderTopWidth,
                ]}
              >
                <Text>Fono</Text>
              </View>
              <View
                style={[
                  styles.boxInfo,
                  styles.boxInfoCustomerSmall,
                  styles.borderRightWidth,
                  styles.borderTopWidth,
                ]}
              >
                <Text>{customer.phone}</Text>
              </View>
              <View
                style={[
                  styles.boxInfo,
                  styles.boxInfoCustomerField,
                  styles.borderTopWidth,
                ]}
              >
                <Text>Atención</Text>
              </View>
              <View
                style={[
                  styles.boxInfo,
                  styles.boxInfoCustomer,
                  styles.borderRightWidth,
                  styles.borderTopWidth,
                  styles.capitalize,
                ]}
              >
                <Text>Sr(a). {customer.attention}</Text>
              </View>
            </View>
            {/* Titulos de productos */}
            <View style={[styles.container, styles.boldText]}>
              <View style={[styles.boxInfo, styles.boxInfoItem]}>
                <Text>Ítem</Text>
              </View>
              <View style={[styles.boxInfo, styles.boxInfoDescription]}>
                <Text>Descripción</Text>
              </View>
              <View style={[styles.boxInfo, styles.boxInfoPrice]}>
                <Text>Cantidad</Text>
              </View>
              <View style={[styles.boxInfo, styles.boxInfoPrice]}>
                <Text>Precio Unit</Text>
              </View>
              <View
                style={[
                  styles.boxInfo,
                  styles.boxInfoPrice,
                  styles.borderRightWidth,
                ]}
              >
                <Text>Precio Total</Text>
              </View>
              <View
                style={[
                  styles.boxInfo,
                  styles.boxInfoNotes,
                  styles.borderLeftWidth,
                  styles.borderRightWidth,
                ]}
              >
                <Text>Notas</Text>
              </View>
            </View>
            {/* Información de productos */}
            {quotations.map((item, index) => (
              <View key={index} style={styles.container}>
                <View
                  style={[
                    styles.boxInfo,
                    styles.boxInfoItem,
                    styles.borderTopWidth,
                  ]}
                >
                  <Text>{index + 1}</Text>
                </View>
                <View
                  style={[
                    styles.boxInfo,
                    styles.boxInfoDescription,
                    styles.borderTopWidth,
                  ]}
                >
                  <Text>{item.description}</Text>
                </View>
                <View
                  style={[
                    styles.boxInfo,
                    styles.boxInfoPrice,
                    styles.borderTopWidth,
                    styles.textRight,
                  ]}
                >
                  <Text>
                    {String(
                      FormattedThousands({ num: item.qty.toString() }) || '',
                    )}
                  </Text>
                </View>
                <View
                  style={[
                    styles.boxInfo,
                    styles.boxInfoPrice,
                    styles.borderTopWidth,
                    styles.textRight,
                  ]}
                >
                  <Text>
                    $
                    {String(
                      FormattedThousands({ num: item.priceUnit.toString() }) ||
                        '',
                    )}
                  </Text>
                </View>
                <View
                  style={[
                    styles.boxInfo,
                    styles.boxInfoPrice,
                    styles.borderTopWidth,
                    styles.borderRightWidth,
                    styles.textRight,
                  ]}
                >
                  <Text>
                    $
                    {String(
                      FormattedThousands({ num: item.total.toString() }) || '',
                    )}
                  </Text>
                </View>
                <View
                  style={[
                    styles.boxInfo,
                    styles.boxInfoNotes,
                    styles.borderLeftWidth,
                    styles.borderTopWidth,
                    styles.borderRightWidth,
                  ]}
                >
                  <Text>{item.notes}</Text>
                </View>
              </View>
            ))}
            {/* Total de productos */}
            <View style={[styles.container, styles.paddingTop_5]}>
              <View
                style={[styles.boxInfoPriceTotal, styles.borderTopWidth]}
              ></View>
              <View
                style={[styles.boxInfo, styles.boxInfoPrice, styles.boldText]}
              >
                <Text>Sub-Total</Text>
              </View>
              <View
                style={[
                  styles.boxInfo,
                  styles.boxInfoPrice,
                  styles.borderRightWidth,
                  styles.textRight,
                ]}
              >
                <Text>
                  ${' '}
                  {String(
                    FormattedThousands({ num: subTotal.toString() }) || '',
                  )}
                </Text>
              </View>
              <View style={[styles.boxInfoNotes, styles.borderTopWidth]}></View>

              <View
                style={[styles.boxInfoPriceTotal, styles.borderTopWidth]}
              ></View>
              <View
                style={[
                  styles.boxInfo,
                  styles.boxInfoPrice,
                  styles.borderTopWidth,
                  styles.boldText,
                ]}
              >
                <Text>Iva</Text>
              </View>
              <View
                style={[
                  styles.boxInfo,
                  styles.boxInfoPrice,
                  styles.borderTopWidth,
                  styles.borderRightWidth,
                  styles.textRight,
                ]}
              >
                <Text>
                  $ {String(FormattedThousands({ num: iva.toString() }) || '')}
                </Text>
              </View>
              <View style={[styles.boxInfoNotes, styles.borderTopWidth]}></View>
              <View
                style={[styles.boxInfoPriceTotal, styles.borderTopWidth]}
              ></View>
              <View
                style={[
                  styles.boxInfo,
                  styles.boxInfoPrice,
                  styles.borderTopWidth,
                  styles.boldText,
                ]}
              >
                <Text>Total</Text>
              </View>
              <View
                style={[
                  styles.boxInfo,
                  styles.boxInfoPrice,
                  styles.borderTopWidth,
                  styles.borderRightWidth,
                  styles.textRight,
                ]}
              >
                <Text>
                  ${' '}
                  {String(FormattedThousands({ num: total.toString() }) || '')}
                </Text>
              </View>
              <View style={[styles.boxInfoNotes, styles.borderTopWidth]}></View>
            </View>
            {/* Notas generales */}
            <View style={[styles.container, styles.paddingTop_10]}>
              <View style={[styles.boxInfo, styles.boxInfoDescription]}>
                <Text>Notas generales</Text>
              </View>
              <View
                style={[
                  styles.boxInfo,
                  styles.boxInfoNotesGral,
                  styles.borderRightWidth,
                ]}
              >
                <Text>{customer.notesGeneral}</Text>
              </View>
            </View>
          </Page>
        </Document>
      }
    >
      {({ url }) =>
        url ? (
          <iframe src={url} style={{ width: '100%', height: '600px' }} />
        ) : (
          'Cargando vista previa...'
        )
      }
    </BlobProvider>
  )
}

export default PdfPrevia
