import React from 'react'
import Image from 'next/image'

import styles from '@/styles/Product.module.scss'
import { parsePrice, parseWeight } from '@/utils/utils'
import Button from './Button'

interface Props {
	product: any
}

const addonRound = (addon: { type: string; text: string } | null) => {
	if (addon && addon.type === 'round') {
		return (
			<div className={`${styles.product_addon} ${styles.round}`}>
				{addon.text}
			</div>
		)
	}
	return null
}

const addonBanner = (addon: { type: string; text: string } | null) => {
	if (addon && addon.type === 'banner') {
		return (
			<div className={`${styles.product_addon} ${styles.banner}`}>
				{addon.text}
			</div>
		)
	}
	return null
}

const Product = ({ product }: Props) => {
	const productData = product.node

	const collection = product.node.collections.nodes[0].handle
	const price = parsePrice(
		productData.priceRange.minVariantPrice.amount,
		collection,
		productData.variants.edges[0].node
	)
	const weight = parseWeight(productData.variants.edges[0].node)
	const imageSrc = productData.images.edges[0].node.transformedSrc
	const addon = product.node.addonType
		? { type: product.node.addonType.value, text: product.node.addonText.value }
		: null

	return (
		<div className={styles.product}>
			{addonRound(addon)}
			<div className={styles.product_container}>
				<div className={styles.product_image_container}>
					<Image
						src={imageSrc}
						alt={productData.title}
						fill
						style={{ objectFit: 'cover' }}
						sizes='(min-width: 60em) 24vw,
					(min-width: 28em) 45vw,
					100vw'
					/>
				</div>
				<div className={styles.product_info_container}>
					<h3
						style={
							addon && addon.type === 'round' ? { width: '65%' } : undefined
						}
					>
						{productData.title}
					</h3>
					{collection !== 'paket' ? <h4>{weight}</h4> : null}
					{addonBanner(addon)}
				</div>
			</div>
			<h4 className={styles.product_price}>{price}</h4>
			<Button
				clickCallback={() =>
					console.log('buy', productData.variants.edges[0].node.id)
				}
			>
				Köp
			</Button>
		</div>
	)
}

export default Product