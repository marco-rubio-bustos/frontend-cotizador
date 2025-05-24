import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  BlobProvider,
} from '@react-pdf/renderer'
import { Spinner } from 'react-bootstrap'
import { FormattedThousands, FormattedDecimals } from '../misc/FormattedNumber'
import { FormatRut } from '../misc/FormattedRut'
import { messages } from '../locales/messages'

const styles = StyleSheet.create({
  image: {
    width: 100,
    margin: '0 20 20 5',
  },
  page: { padding: 20 },
  section: { marginBottom: 0 },
  title: { fontSize: 16 },
  num: { fontWeight: 'bold', fontSize: 22, paddingBottom: 20 },
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
    width: 290,
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
  date,
  customer,
  quotations,
  subTotal,
  iva,
  total,
}: {
  quotation: number
  date?: string
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
  const formatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  } as const

  const creationDate = new Date(date ?? Date.now()).toLocaleDateString(
    'es-ES',
    formatOptions,
  )

  return (
    <BlobProvider
      document={
        <Document>
          <Page size="LETTER" style={styles.page}>
            {/* Información sobre la Empresa */}
            <View style={[styles.container, styles.paddingBottom]}>
              <View>
                <Image src={messages.company.logo} style={styles.image} />
              </View>
              <View style={styles.boxCompany}>
                <Text style={[styles.text, styles.boldText]}>
                  {messages.company.name}
                </Text>
                <Text style={styles.text}>{messages.company.companyName}</Text>
                <Text style={styles.text}>
                  Dirección: {messages.company.address}
                </Text>
                <Text style={styles.text}>
                  Fonos:{messages.company.phone} - {messages.company.celular}
                </Text>
                <Text style={styles.text}>
                  {messages.company.website} - {messages.company.email}
                </Text>
              </View>
              <View style={styles.boxQuotation}>
                <Text style={styles.title}>Cotización N°</Text>
                <Text style={styles.num}>{quotation}</Text>
                <Text style={styles.text}>Fecha de Emisión:</Text>
                <Text style={styles.text}>{creationDate}</Text>
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
                  <FormatRut rut={customer.rut} />
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
                  <Text>{String(FormattedThousands({ num: item.qty }))}</Text>
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
                      FormattedDecimals({ num: item.priceUnit.toString() }) ||
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
          <div className="d-flex justify-content-center align-items-center vh-100">
            <Spinner animation="grow" variant="warning" />
          </div>
        )
      }
    </BlobProvider>
  )
}

export default PdfPrevia
