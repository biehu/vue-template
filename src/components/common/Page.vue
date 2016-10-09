<template>
    <div class="page">
        <ul class="pagination">
            <li v-if="currentPage > 1">
                <a href="#" aria-label="Previous"
                   @click.prevent="changePage(currentPage - 1)">
                    <span aria-hidden="true">«</span>
                </a>
            </li>
            <li v-for="page in pagesNumber"
                v-bind:class="[ page == isActived ? 'active' : '']">
                <a href="#"
                   @click.prevent="changePage(page)">{{ page }}</a>
            </li>
            <li v-if="currentPage < lastPage">
                <a href="#" aria-label="Next"
                   @click.prevent="changePage(currentPage + 1)">
                    <span aria-hidden="true">»</span>
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
	export default {
		name: 'Page',
		
		props: {
			currentPage: {
				type: Number,
				default: 1
			},
			lastPage: {
				type: Number,
				required: true
			},
			offset: {
				type:Number,
				default: 3
			}
		},
		
		methods: {
			changePage(page) {
                this.$dispatch('change-page', page);
            }
		},
		
		computed: {
			isActived() {
				return this.currentPage;
			},
			pagesNumber() {
				if (!this.lastPage) return [];
				
				var from = this.currentPage - this.offset;
				if (from < 1) from = 1;
				
				var to = from + this.offset * 2;
				if (to >= this.lastPage) to = this.lastPage;
				
				var pages = [];
				while (from <= to) {
					pages.push(from);
					from++;
				}
				
				return pages;
			}
		}
		
	};
</script>