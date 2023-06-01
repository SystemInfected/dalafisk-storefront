import { useState } from 'react'
import Head from 'next/head'

import { gqlShopify } from '@/pages/api/graphql'
import {
	GET_PAYMENT_METHODS,
	GET_PRODUCT,
	GET_SHOP_NAME,
} from '@/pages/api/queries'
import { parsePrice, parseWeight } from '@/utils/utils'

import layout from '@/styles/Layout.module.scss'
import styles from '@/styles/ProductPage.module.scss'
import PageHeader from '@/components/PageHeader'
import PageContent from '@/components/PageContent'
import ImageViewer from '@/components/ImageViewer'
import InfoIcon from '@/components/InfoIcon'

const ProductPage = ({ shopName, product }: any) => {
	const [priceState, setPriceState] = useState(
		product.priceRange.minVariantPrice.amount
	)
	const [comparePriceState, setComparePriceState] = useState(
		product.compareAtPriceRange.minVariantPrice.amount
	)
	const [weightState, setWeightState] = useState(product.variants.edges[0].node)

	const title = `${shopName} | Produkter - ${product.title}`

	const collection = product.collections.nodes[0].handle
	const price = parsePrice(priceState, 'fullPrice', weightState)
	const comparePrice = parsePrice(comparePriceState, 'fullPrice', weightState)
	const addon = product.addonType
		? { type: product.addonType.value, text: product.addonText.value }
		: null
	const weight = parseWeight(weightState).replace('.', ',')
	const infoData = [
		{ type: 'latin', value: product.infoLatin?.value },
		{ type: 'fangst', value: product.infoFangst?.value },
		{ type: 'storlek', value: product.infoStorlek?.value },
		{ type: 'hallbarhet', value: product.infoHallbarhet?.value },
		{ type: 'tillagning', value: product.infoTillagning?.value },
		{ type: 'tillstand', value: product.infoTillstand?.value },
	].filter((info) => info.value !== undefined)

	console.log(product)

	const ctaContent = () => {
		return (
			<>
				<div>Variants</div>
				<div>Buy CTA</div>
			</>
		)
	}

	return (
		<>
			<Head>
				<title>{title}</title>
				<meta name='description' content='Generated by create next app' />
			</Head>
			<div className={`${layout.container} ${layout.no_top_margin}`}>
				<div className={styles.wrapped_container}>
					<PageHeader leftAlign style={{ marginBottom: '1em' }}>
						{product.title}
					</PageHeader>
				</div>
				<div
					className={`${layout.two_column_grid} ${styles.wrapped_container}`}
				>
					<ImageViewer
						images={product.images}
						productTitle={product.title}
						addon={addon}
					/>
					<div
						className={`${layout.two_column_grid} ${styles.wrapped_container} ${styles.cta_mobile}`}
					>
						{ctaContent()}
					</div>
					<div className={styles.additional_info}>
						<div>
							<div className={styles.product_price}>
								<h3>{price}</h3>
								{product.compareAtPriceRange.minVariantPrice.amount !==
								'0.0' ? (
									<h4>{comparePrice}</h4>
								) : null}
							</div>
							{collection !== 'paket' ? <h4>{weight}</h4> : null}
						</div>
						<div className={styles.info_container}>
							{infoData.map((info) => (
								<div key={info.type}>
									<InfoIcon type={info.type} />{' '}
									<span title={info.value}>{info.value}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
			<div className={`${layout.container} ${layout.no_top_margin}`}>
				<div
					className={`${layout.two_column_grid} ${styles.wrapped_container} ${styles.cta_desktop}`}
				>
					{ctaContent()}
				</div>
			</div>
			<PageContent contentOnly content={product.descriptionHtml} />
		</>
	)
}

export const getServerSideProps = async (context: any) => {
	const { produkt } = context.query

	const product = await gqlShopify(GET_PRODUCT, { handle: produkt })

	const shop = await gqlShopify(GET_SHOP_NAME, {})

	const paymentMethods = await gqlShopify(GET_PAYMENT_METHODS, {})

	const gqlData = {
		shopName: shop.shop.name,
		product: product.productByHandle,
		paymentMethods: paymentMethods.shop.paymentSettings,
	}

	return {
		props: { ...gqlData },
	}
}

export default ProductPage
